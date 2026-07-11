/** Default issue/due dates for a new invoice (issued today, due in 14 days). */
export function defaultInvoiceDates() {
  const issueDate = new Date();
  const dueDate = new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  return {
    issueDate: issueDate.toISOString().slice(0, 10),
    dueDate: dueDate.toISOString().slice(0, 10),
  };
}
