import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

/**
 * Data shape for rendering an invoice. Kept independent of Prisma's
 * Decimal/Date types (plain numbers/strings) so this component can be reused
 * for both PDF export (this file) and an on-screen preview, without either
 * consumer needing to know about Prisma.
 */
export type InvoicePdfData = {
  number: number | null;
  issueDate: string;
  dueDate: string;
  vatRate: number;
  subtotalAmount: number;
  vatAmount: number;
  totalAmount: number;
  currency: string;
  organization: {
    name: string;
    cvrNumber: string;
    addressLine1: string;
    addressLine2: string | null;
    postalCode: string;
    city: string;
    country: string;
  };
  client: {
    name: string;
    cvrNumber: string | null;
    addressLine1: string;
    addressLine2: string | null;
    postalCode: string;
    city: string;
    country: string;
  };
  lineItems: { description: string; quantity: number; unitPrice: number }[];
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#18181b" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  muted: { color: "#71717a" },
  addressBlock: { marginBottom: 4 },
  partiesRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
  partyColumn: { width: "45%" },
  partyLabel: { fontSize: 9, color: "#71717a", marginBottom: 4, textTransform: "uppercase" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  table: { borderTopWidth: 1, borderTopColor: "#e4e4e7" },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingVertical: 6,
  },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f4f4f5", paddingVertical: 6 },
  colDescription: { width: "50%" },
  colQuantity: { width: "15%", textAlign: "right" },
  colUnitPrice: { width: "17.5%", textAlign: "right" },
  colTotal: { width: "17.5%", textAlign: "right" },
  totalsBlock: { marginTop: 16, alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", width: 180, marginBottom: 4 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 180,
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
  },
  grandTotalText: { fontWeight: 700 },
});

export function InvoicePdfDocument({ invoice }: { invoice: InvoicePdfData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>
              {invoice.number ? `Faktura #${invoice.number}` : "Kladde"}
            </Text>
            <Text style={styles.muted}>CVR {invoice.organization.cvrNumber}</Text>
          </View>
        </View>

        <View style={styles.partiesRow}>
          <View style={styles.partyColumn}>
            <Text style={styles.partyLabel}>Fra</Text>
            <Text>{invoice.organization.name}</Text>
            <Text style={styles.addressBlock}>{invoice.organization.addressLine1}</Text>
            {invoice.organization.addressLine2 && (
              <Text style={styles.addressBlock}>{invoice.organization.addressLine2}</Text>
            )}
            <Text>
              {invoice.organization.postalCode} {invoice.organization.city}
            </Text>
            <Text>{invoice.organization.country}</Text>
          </View>
          <View style={styles.partyColumn}>
            <Text style={styles.partyLabel}>Til</Text>
            <Text>{invoice.client.name}</Text>
            {invoice.client.cvrNumber && <Text>CVR {invoice.client.cvrNumber}</Text>}
            <Text style={styles.addressBlock}>{invoice.client.addressLine1}</Text>
            {invoice.client.addressLine2 && (
              <Text style={styles.addressBlock}>{invoice.client.addressLine2}</Text>
            )}
            <Text>
              {invoice.client.postalCode} {invoice.client.city}
            </Text>
            <Text>{invoice.client.country}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text>Fakturadato: {invoice.issueDate}</Text>
          <Text>Forfaldsdato: {invoice.dueDate}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colDescription}>Beskrivelse</Text>
            <Text style={styles.colQuantity}>Antal</Text>
            <Text style={styles.colUnitPrice}>Pris</Text>
            <Text style={styles.colTotal}>I alt</Text>
          </View>
          {invoice.lineItems.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQuantity}>{item.quantity}</Text>
              <Text style={styles.colUnitPrice}>
                {item.unitPrice.toLocaleString("da-DK")} {invoice.currency}
              </Text>
              <Text style={styles.colTotal}>
                {(item.quantity * item.unitPrice).toLocaleString("da-DK")}{" "}
                {invoice.currency}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.muted}>Subtotal</Text>
            <Text>
              {invoice.subtotalAmount.toLocaleString("da-DK")} {invoice.currency}
            </Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.muted}>Moms ({(invoice.vatRate * 100).toFixed(0)}%)</Text>
            <Text>
              {invoice.vatAmount.toLocaleString("da-DK")} {invoice.currency}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalText}>Total</Text>
            <Text style={styles.grandTotalText}>
              {invoice.totalAmount.toLocaleString("da-DK")} {invoice.currency}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
