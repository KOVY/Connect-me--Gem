-- ========================================
-- 💰 INTERNATIONAL CREDIT PRICING & PAYOUT SYSTEM
-- Anti-arbitrage with fixed exchange rates
-- 60% platform commission on payouts
-- ========================================

-- KROK 1: Pricing Configuration Table
CREATE TABLE IF NOT EXISTS public.credit_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_name TEXT NOT NULL, -- e.g., "Starter", "Popular", "Best Value"
    credit_amount INTEGER NOT NULL, -- How many credits user gets
    currency TEXT NOT NULL, -- ISO currency code (USD, EUR, CZK, GBP, etc.)
    price DECIMAL(10, 2) NOT NULL, -- Price in that currency
    price_usd DECIMAL(10, 2) NOT NULL, -- Normalized price in USD (for anti-arbitrage)
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate packages for same currency
    UNIQUE(package_name, currency, credit_amount)
);

-- Index pro rychlé vyhledávání podle měny
CREATE INDEX idx_credit_pricing_currency ON public.credit_pricing(currency, is_active);
CREATE INDEX idx_credit_pricing_active ON public.credit_pricing(is_active, sort_order);

-- KROK 2: Fixed Exchange Rates (Anti-Arbitrage Protection)
-- Mírně podstřelené pod skutečným trhem, aby nikdo nejezdil přes hranice
CREATE TABLE IF NOT EXISTS public.exchange_rates (
    currency TEXT PRIMARY KEY, -- ISO currency code
    rate_to_usd DECIMAL(10, 6) NOT NULL, -- How much USD is 1 unit of this currency
    display_symbol TEXT NOT NULL, -- e.g., "$", "€", "Kč", "£"
    country_code TEXT NOT NULL, -- e.g., "US", "CZ", "DE"
    is_active BOOLEAN DEFAULT true,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT -- Admin notes about why this rate was chosen
);

COMMENT ON TABLE public.exchange_rates IS 'Fixed exchange rates for credit pricing - intentionally set below market rates to prevent arbitrage';

-- KROK 3: User Credit Balance (rozšíření existující tabulky)
-- Přidáme sloupce pro earned credits (z dárečků) a cash balance (dostupné k výplatě)
ALTER TABLE public.credits
ADD COLUMN IF NOT EXISTS earned_credits INTEGER DEFAULT 0, -- Kredity získané z dárečků od ostatních
ADD COLUMN IF NOT EXISTS purchased_credits INTEGER DEFAULT 0, -- Kredity koupené přes Stripe
ADD COLUMN IF NOT EXISTS cash_balance_usd DECIMAL(10, 2) DEFAULT 0.00, -- Peníze k výplatě (USD)
ADD COLUMN IF NOT EXISTS lifetime_earnings_usd DECIMAL(10, 2) DEFAULT 0.00, -- Celkové výdělky (pro stats)
ADD COLUMN IF NOT EXISTS lifetime_spent_credits INTEGER DEFAULT 0; -- Celkem utracených kreditů (pro stats)

-- Trigger pro update balance (automatický přepočet)
CREATE OR REPLACE FUNCTION update_credit_balance()
RETURNS TRIGGER AS $$
BEGIN
    NEW.balance = COALESCE(NEW.purchased_credits, 0) + COALESCE(NEW.earned_credits, 0);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_credit_balance ON public.credits;
CREATE TRIGGER trigger_update_credit_balance
    BEFORE UPDATE OF purchased_credits, earned_credits ON public.credits
    FOR EACH ROW
    EXECUTE FUNCTION update_credit_balance();

-- KROK 4: Payout Requests Table
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount_usd DECIMAL(10, 2) NOT NULL, -- Kolik chce uživatel vybrat (v USD)
    amount_after_commission DECIMAL(10, 2) NOT NULL, -- Po odečtení 60% provize
    commission_rate DECIMAL(5, 4) DEFAULT 0.60, -- 60% provize pro platformu
    currency TEXT NOT NULL, -- Měna, do které se vyplácí
    payout_amount DECIMAL(10, 2) NOT NULL, -- Finální částka v cílové měně

    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),

    -- Stripe/payment details
    stripe_payout_id TEXT, -- Stripe Payout ID
    payment_method TEXT, -- e.g., "bank_account", "paypal", "card"
    payment_details JSONB, -- Email, IBAN, atd. (encrypted in production)

    -- Audit trail
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_reason TEXT,

    -- Admin notes
    admin_notes TEXT
);

CREATE INDEX idx_payout_requests_user ON public.payout_requests(user_id, status);
CREATE INDEX idx_payout_requests_status ON public.payout_requests(status, requested_at);

COMMENT ON TABLE public.payout_requests IS 'User requests to cash out their earned credits. Platform takes 60% commission.';

-- KROK 5: Payout History (pro audit)
CREATE TABLE IF NOT EXISTS public.payout_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payout_request_id UUID REFERENCES public.payout_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- e.g., "created", "approved", "completed", "failed"
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID -- Admin user ID who performed action
);

-- KROK 6: Gift Transactions Enhancement
-- Když uživatel pošle dáreček, příjemce dostane earned_credits
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS recipient_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS gift_id TEXT, -- ID dárečku z constants
ADD COLUMN IF NOT EXISTS credit_amount INTEGER; -- Kolik kreditů tento transaction představuje

-- KROK 7: RLS Policies
ALTER TABLE public.credit_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_history ENABLE ROW LEVEL SECURITY;

-- Pricing je public read-only
CREATE POLICY "Credit pricing is viewable by everyone"
    ON public.credit_pricing FOR SELECT
    USING (is_active = true);

-- Exchange rates jsou public read-only
CREATE POLICY "Exchange rates are viewable by everyone"
    ON public.exchange_rates FOR SELECT
    USING (is_active = true);

-- Payout requests - uživatel vidí jen své
CREATE POLICY "Users can view their own payout requests"
    ON public.payout_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payout requests"
    ON public.payout_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Payout history - uživatel vidí jen svou
CREATE POLICY "Users can view their own payout history"
    ON public.payout_history FOR SELECT
    USING (auth.uid() = user_id);

-- ========================================
-- SEED DATA: Fixed Exchange Rates
-- ========================================

INSERT INTO public.exchange_rates (currency, rate_to_usd, display_symbol, country_code, notes) VALUES
-- Hlavní měny (podstřelené cca 3-5% pod trhem)
('USD', 1.000000, '$', 'US', 'Base currency'),
('EUR', 1.080000, '€', 'EU', 'Market ~1.10, set at 1.08 to prevent arbitrage'),
('GBP', 1.250000, '£', 'GB', 'Market ~1.27, set at 1.25 to prevent arbitrage'),
('CZK', 0.044000, 'Kč', 'CZ', 'Market ~0.046, set at 0.044 to prevent arbitrage'),

-- Další evropské měny
('PLN', 0.245000, 'zł', 'PL', 'Market ~0.25, set at 0.245'),
('HUF', 0.0028000, 'Ft', 'HU', 'Market ~0.0029, set at 0.0028'),
('RON', 0.215000, 'lei', 'RO', 'Market ~0.22, set at 0.215'),

-- Další světové měny
('CAD', 0.725000, 'C$', 'CA', 'Market ~0.74, set at 0.725'),
('AUD', 0.655000, 'A$', 'AU', 'Market ~0.67, set at 0.655'),
('JPY', 0.0068000, '¥', 'JP', 'Market ~0.007, set at 0.0068'),
('CHF', 1.120000, 'CHF', 'CH', 'Market ~1.14, set at 1.12')
ON CONFLICT (currency) DO UPDATE SET
    rate_to_usd = EXCLUDED.rate_to_usd,
    last_updated = NOW();

-- ========================================
-- SEED DATA: Credit Packages
-- ========================================

-- Helper function pro vytvoření pricing packages
DO $$
DECLARE
    currencies TEXT[] := ARRAY['USD', 'EUR', 'GBP', 'CZK', 'PLN', 'CAD', 'AUD'];
    base_usd_price DECIMAL(10, 2);
    curr TEXT;
    rate DECIMAL(10, 6);
BEGIN
    -- Package 1: Starter (100 credits)
    base_usd_price := 4.99;
    FOREACH curr IN ARRAY currencies LOOP
        SELECT rate_to_usd INTO rate FROM public.exchange_rates WHERE currency = curr;
        INSERT INTO public.credit_pricing (package_name, credit_amount, currency, price, price_usd, sort_order)
        VALUES ('Starter', 100, curr, ROUND(base_usd_price / rate, 2), base_usd_price, 1)
        ON CONFLICT (package_name, currency, credit_amount) DO UPDATE SET
            price = EXCLUDED.price,
            price_usd = EXCLUDED.price_usd;
    END LOOP;

    -- Package 2: Popular (500 credits) - 20% discount
    base_usd_price := 19.99;
    FOREACH curr IN ARRAY currencies LOOP
        SELECT rate_to_usd INTO rate FROM public.exchange_rates WHERE currency = curr;
        INSERT INTO public.credit_pricing (package_name, credit_amount, currency, price, price_usd, sort_order)
        VALUES ('Popular', 500, curr, ROUND(base_usd_price / rate, 2), base_usd_price, 2)
        ON CONFLICT (package_name, currency, credit_amount) DO UPDATE SET
            price = EXCLUDED.price,
            price_usd = EXCLUDED.price_usd;
    END LOOP;

    -- Package 3: Best Value (1000 credits) - 30% discount
    base_usd_price := 34.99;
    FOREACH curr IN ARRAY currencies LOOP
        SELECT rate_to_usd INTO rate FROM public.exchange_rates WHERE currency = curr;
        INSERT INTO public.credit_pricing (package_name, credit_amount, currency, price, price_usd, sort_order)
        VALUES ('Best Value', 1000, curr, ROUND(base_usd_price / rate, 2), base_usd_price, 3)
        ON CONFLICT (package_name, currency, credit_amount) DO UPDATE SET
            price = EXCLUDED.price,
            price_usd = EXCLUDED.price_usd;
    END LOOP;

    -- Package 4: Premium (2500 credits) - 40% discount
    base_usd_price := 74.99;
    FOREACH curr IN ARRAY currencies LOOP
        SELECT rate_to_usd INTO rate FROM public.exchange_rates WHERE currency = curr;
        INSERT INTO public.credit_pricing (package_name, credit_amount, currency, price, price_usd, sort_order)
        VALUES ('Premium', 2500, curr, ROUND(base_usd_price / rate, 2), base_usd_price, 4)
        ON CONFLICT (package_name, currency, credit_amount) DO UPDATE SET
            price = EXCLUDED.price,
            price_usd = EXCLUDED.price_usd;
    END LOOP;
END $$;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Zobrazit pricing pro všechny měny
SELECT
    package_name,
    credit_amount,
    currency,
    price,
    price_usd,
    ROUND((price_usd / credit_amount) * 100, 2) as cost_per_100_credits_usd
FROM public.credit_pricing
WHERE is_active = true
ORDER BY currency, sort_order;

-- Zobrazit exchange rates
SELECT
    currency,
    display_symbol,
    rate_to_usd,
    country_code,
    notes
FROM public.exchange_rates
WHERE is_active = true
ORDER BY rate_to_usd DESC;

COMMIT;
