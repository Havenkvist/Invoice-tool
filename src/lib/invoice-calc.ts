/** Computes subtotal/VAT/total for a set of line items and a VAT rate. */
export function calculateInvoiceTotals(
  lineItems: { quantity: number; unitPrice: number }[],
  vatRate: number,
) {
  const subtotalAmount = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const vatAmount = subtotalAmount * vatRate;
  const totalAmount = subtotalAmount + vatAmount;

  return { subtotalAmount, vatAmount, totalAmount };
}
