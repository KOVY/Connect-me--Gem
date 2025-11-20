# Content Security Policy (CSP) Documentation

## Přehled

Tato aplikace používá Content Security Policy (CSP) pro ochranu proti XSS a dalším bezpečnostním hrozbám. Některé direktivy jsou nastaveny permisivněji než obvykle z důvodu specifických technických požadavků.

## Bezpečnostní Direktivy

### ✅ Implementováno

| Direktiva | Hodnota | Důvod |
|-----------|---------|-------|
| `default-src` | `'self'` | Výchozí omezení na vlastní doménu |
| `frame-ancestors` | `'none'` | Ochrana proti clickjackingu |
| `object-src` | `'none'` | Blokování Flash a plugin objektů |
| `base-uri` | `'self'` | Prevence base tag injection |
| `form-action` | `'self'` | Omezení form submissions |
| `upgrade-insecure-requests` | ✓ | Force HTTPS pro všechny requesty |

### ⚠️ Permisivní Direktivy (S Odůvodněním)

#### 1. `script-src 'unsafe-eval'`

**Problém**: Narušuje ochranu proti XSS
**Důvod**: **POVINNÉ** - Google Gemini AI SDK načítaný přes esm.sh používá `eval()` pro dynamické načítání modulů

```javascript
// Gemini SDK interně používá:
new Function('...') // Requires 'unsafe-eval'
```

**Alternativy zvážené**:
- ❌ Selfhost Gemini SDK - SDK je příliš velké a často updateované
- ❌ Použít jiné AI API - Gemini je námi zvolené řešení pro AI funkce
- ❌ Odstranit AI features - Klíčová funkcionalita aplikace

**Rozhodnutí**: Ponechat `'unsafe-eval'` s vědomím rizika. Kompenzace:
- Striktní validace všech user inputů před odesláním do AI
- Sanitizace AI responses před renderem
- Regular security audits

#### 2. `style-src 'unsafe-inline'`

**Důvod**: React inline styles a styled-components
**Riziko**: Nízké - inline styles nemohou spustit JavaScript
**Alternativa**: CSS-in-JS s nonce (komplexní implementace pro malý bezpečnostní zisk)

#### 3. `img-src` - Omezené externí domény

```
img-src 'self' data: blob:
  https://images.unsplash.com
  https://haayvhkovottszzdnzbz.supabase.co
  https://lh3.googleusercontent.com
```

**Důvod**:
- `images.unsplash.com` - Stock fotografie pro profily
- `supabase.co` - User-uploaded avatary a content
- `lh3.googleusercontent.com` - Google OAuth profile pictures
- `data:` - Base64 encoded images (avatary)
- `blob:` - Client-side generated images (canvas, crop tools)

### 🔒 Odebrané Direktivy

#### ~~`script-src 'unsafe-inline'`~~

**Status**: ✅ **ODSTRANĚNO**
**Důvod**: Moderní Vite/React build nepotřebuje inline scripts
**Bezpečnostní zisk**: Významná ochrana proti stored XSS

#### ~~`X-XSS-Protection`~~

**Status**: ✅ **ODSTRANĚNO**
**Důvod**: Deprecated header, může způsobit více škody než užitku v moderních prohlížečích
**Náhrada**: Silný CSP poskytuje lepší ochranu

#### ~~`X-Frame-Options: DENY`~~

**Status**: ✅ **ZMĚNĚNO na SAMEORIGIN**
**Důvod**:
- `DENY` může blokovat legitimate OAuth flow (např. Google login v iframe)
- `SAMEORIGIN` stále chrání proti externí clickjacking
- CSP `frame-ancestors 'none'` poskytuje dodatečnou ochranu

## Compliance & Audit Trail

### Compliance Checks (Qodo Merge)

Aplikace byla auditována Qodo Merge security compliance:

1. ⚠️ **Weak CSP policy** - Acknowledged, `unsafe-eval` je technická nutnost
2. ✅ **Deprecated headers** - X-XSS-Protection odstraněn
3. ✅ **Overly broad img-src** - Změněno z `https:` na whitelist
4. ✅ **Strict framing** - Změněno z DENY na SAMEORIGIN

### Monitoring & Logging

```sql
-- Supabase: Monitor CSP violations (pokud máte reportování)
SELECT * FROM csp_violations
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY count DESC;
```

## Best Practices

### Pro vývojáře:

1. **Nikdy nepřidávat inline event handlers**
   ```html
   <!-- ❌ NIKDY -->
   <button onclick="doSomething()">Click</button>

   <!-- ✅ VŽDY -->
   <button onClick={handleClick}>Click</button>
   ```

2. **Validovat user input před AI processing**
   ```typescript
   // ✅ DOBRÝ PŘÍKLAD
   const sanitizedInput = DOMPurify.sanitize(userInput);
   const response = await geminiAI.generate(sanitizedInput);
   ```

3. **Escapovat AI responses**
   ```typescript
   // ✅ React automaticky escapuje
   <div>{aiResponse}</div>

   // ⚠️ Pokud používáte dangerouslySetInnerHTML
   <div dangerouslySetInnerHTML={{
     __html: DOMPurify.sanitize(aiResponse)
   }} />
   ```

### Pro security review:

- 🔍 Pravidelně auditovat `unsafe-eval` usage
- 🔍 Monitorovat CSP violation reports
- 🔍 Testovat XSS vectors ve všech user input polích
- 🔍 Ověřit že Gemini SDK stále vyžaduje eval (při updates)

## Future Improvements

### Možné zlepšení v budoucnu:

1. **CSP Level 3 nonce/hash**
   - Použít `script-src 'nonce-xxx'` místo `unsafe-eval`
   - Vyžaduje server-side rendering nebo edge computing

2. **Subresource Integrity (SRI)**
   ```html
   <script src="https://esm.sh/..."
           integrity="sha384-..."
           crossorigin="anonymous"></script>
   ```

3. **CSP Reporting**
   ```
   Content-Security-Policy-Report-Only: ...; report-uri /api/csp-violations
   ```

## References

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Google: CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [OWASP: XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Gemini AI SDK Documentation](https://ai.google.dev/gemini-api/docs)

---

**Poslední update**: 2025-11-20
**Odpovědná osoba**: DevOps/Security Team
**Review cycle**: Každých 3 měsíce nebo při major changes
