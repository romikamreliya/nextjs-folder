// ── Project-Specific Helpers ─────────────────────────────────────────────────
// Add project-specific utility functions here.
// Keep this file for business logic helpers that don't fit in utils.js
// (which is for generic, project-agnostic utilities).
//
// Example:
// export function calcLineAmounts({ qty, unitPrice, discountPercent, taxPercent }) {
//     const qtyNum = parseFloat(qty) || 0;
//     const price = parseFloat(unitPrice) || 0;
//     const discountPct = parseFloat(discountPercent) || 0;
//     const taxPct = parseFloat(taxPercent) || 0;
//     const subtotal = qtyNum * price;
//     const discountAmount = subtotal * (discountPct / 100);
//     const taxableAmount = subtotal - discountAmount;
//     const taxAmount = taxableAmount * (taxPct / 100);
//     return {
//         discountAmount: discountAmount.toFixed(2),
//         taxAmount: taxAmount.toFixed(2),
//     };
// }
