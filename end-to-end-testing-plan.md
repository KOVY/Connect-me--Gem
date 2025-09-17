# End-to-End Testing Plan: Monetization Flow

This document outlines the end-to-end test cases for the core monetization features of the Aura dating application.

**Preconditions:**
*   The application is running locally (`localhost:3000`).
*   The mock API is running and serving data.
*   The browser's developer console is open to monitor logs and use the debugging helper: `window.getMockData()`.
*   The application is in a clean state (e.g., refresh the page).

---

### Test Case 1: Successful Credit Purchase

**Objective:** Verify that a user can successfully purchase a credit package and their balance is updated correctly across the application.

| Step | Action | Expected UI Result | Expected Data Result (via `window.getMockData()`) |
| :--- | :--- | :--- | :--- |
| 1 | **Initial Check:** Open the developer console and run `window.getMockData()`. Note the initial `credits` and number of `transactions`. | The `BalanceWidget` in the header shows the initial credit amount (e.g., 500). | `currentUser.balance.credits` matches the UI. |
| 2 | Navigate to the Profile Hub by clicking the balance widget in the header. | The Profile Hub modal/page appears, showing the "Overview" tab. | - |
| 3 | Click on the "Shop" tab. | The Credit Shop is displayed, showing available credit packages. | - |
| 4 | Click "Buy" on the "250 Credits" package. | The purchase confirmation modal appears. | - |
| 5 | Select the default payment method and click "Confirm Purchase". | A "Processing..." state shows, followed by a "Success!" message. The modal closes. | - |
| 6 | **Validation:** Observe the `BalanceWidget` in the header and on the "Overview" tab. | The credit balance instantly updates to reflect the new total (e.g., `500 + 250 + 25 bonus = 775`). | Run `window.getMockData()`. `currentUser.balance.credits` should be **775**. |
| 7 | **Validation:** Navigate to the "History" tab. | The transaction history is displayed. | A new `purchase` transaction appears at the top. The total transaction count has increased by one. |

---

### Test Case 2: Successful Gift Sending

**Objective:** Verify that a user can send a gift, their credit balance is deducted, their gift stats are updated (for testing), and the interaction is recorded.

| Step | Action | Expected UI Result | Expected Data Result (via `window.getMockData()`) |
| :--- | :--- | :--- | :--- |
| 1 | From the discovery feed, swipe to a profile (e.g., Alice) and click the heart icon to enter the chat. | The Chat page for Alice loads. The initial system message is present. | - |
| 2 | Click the gift icon next to the message input. | The `GiftSelectionModal` opens, showing available gifts and the current credit balance (e.g., 775). | - |
| 3 | Select a gift the user can afford (e.g., Rose - 10 credits). | The confirmation screen appears. | - |
| 4 | Click "Confirm & Send". | The modal closes. A message "You sent Alice a Rose 🌹!" appears in the chat history. | - |
| 5 | **Validation:** Observe the `BalanceWidget` in the header. | The credit balance instantly updates to `765`. | Run `window.getMockData()`. `currentUser.balance.credits` should be **765**. |
| 6 | **Validation:** Navigate to the Profile Hub -> "History" tab. | The transaction history is displayed. | A new `gift_sent` transaction with an amount of `-10` appears at the top. |
| 7 | **Validation:** Navigate to Profile Hub -> "Overview" tab. | The "Received Gifts" and "Total Gift Value" in the `BalanceWidget` should have increased (this simulates the recipient's side for our test). | `currentUser.balance.receivedGifts` and `totalReceivedValue` should have increased by 1 and 10 respectively. |

---

### Test Case 3: Insufficient Funds for Gift

**Objective:** Verify that the UI prevents a user from sending a gift they cannot afford and provides clear feedback.

| Step | Action | Expected UI Result | Expected Data Result (via `window.getMockData()`) |
| :--- | :--- | :--- | :--- |
| 1 | **Setup:** Use `window.getMockData().currentUser.balance.credits = 5;` in the console to manually set a low credit balance. Refresh the page to ensure UI updates. | The `BalanceWidget` shows "5 Credits". | `currentUser.balance.credits` is **5**. Note the transaction count. |
| 2 | Open the chat with any user and open the `GiftSelectionModal`. | The modal opens. The "Rose" (cost 10) and other gifts should appear visually disabled (e.g., greyed out, lower opacity). The buttons should not be clickable. | - |
| 3 | Close the modal. | The chat interface returns to normal. No gift message is sent. | - |
| 4 | **Validation:** Navigate to Profile Hub -> "History" tab. | The transaction history is displayed. | Run `window.getMockData()`. The transaction count should be unchanged from step 1. `currentUser.balance.credits` is still **5**. |

---

### Test Case 4: Successful Gift Redemption

**Objective:** Verify the UI flow for a user redeeming the value of gifts they have received.

| Step | Action | Expected UI Result | Expected Data Result (via `window.getMockData()`) |
| :--- | :--- | :--- | :--- |
| 1 | **Setup:** Ensure the user has received gifts (e.g., by completing Test Case 2). | The `BalanceWidget` shows a non-zero "Total Gift Value" (e.g., "10"). | Run `window.getMockData()`. `currentUser.balance.totalReceivedValue > 0`. |
| 2 | In the Profile Hub "Overview" tab, click the "Redeem Gifts" button. | The `RedeemGiftsModal` opens to Step 1, showing the total value, service fee (60%), and final payout amount. | - |
| 3 | Click "Continue". | The modal moves to Step 2, showing a (mock) form for payout information. | - |
| 4 | Click "Request Payout". | The modal shows a success message: "Your request has been submitted!". The modal can be closed. | - |
| 5 | **Validation:** Observe the `BalanceWidget` on the "Overview" tab. | The "Received Gifts" and "Total Gift Value" should instantly update to **0**. The "Redeem Gifts" button should become disabled. | Run `window.getMockData()`. `currentUser.balance.receivedGifts` and `totalReceivedValue` should both be **0**. |
| 6 | **Validation:** Navigate to the "History" tab. | The transaction history is displayed. | A new `payout` transaction should be at the top of the list. |