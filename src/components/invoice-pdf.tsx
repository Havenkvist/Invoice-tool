import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { toIntlLocale, type Locale } from "@/i18n/config";
import { translate } from "@/i18n/dictionaries";

export type InvoicePdfData = {
  number: number | null;
  issueDate: string;
  dueDate: string;
  vatRate: number;
  subtotalAmount: number;
  vatAmount: number;
  totalAmount: number;
  currency: string;
  customFields: { label: string; value: string }[];
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
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  customFieldsBlock: { marginBottom: 24 },
  customFieldRow: { flexDirection: "row", marginBottom: 2 },
  customFieldLabel: { width: 140, color: "#71717a" },
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

export function InvoicePdfDocument({
  invoice,
  locale,
}: {
  invoice: InvoicePdfData;
  locale: Locale;
}) {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(locale, "pdf", key, params);
  const intl = toIntlLocale(locale);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>
              {invoice.number
                ? t("Faktura #%{number}", { number: invoice.number })
                : t("Kladde")}
            </Text>
            <Text style={styles.muted}>
              {t("CVR %{number}", { number: invoice.organization.cvrNumber })}
            </Text>
          </View>
        </View>

        <View style={styles.partiesRow}>
          <View style={styles.partyColumn}>
            <Text style={styles.partyLabel}>{t("Fra")}</Text>
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
            <Text style={styles.partyLabel}>{t("Til")}</Text>
            <Text>{invoice.client.name}</Text>
            {invoice.client.cvrNumber && (
              <Text>{t("CVR %{number}", { number: invoice.client.cvrNumber })}</Text>
            )}
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
          <Text>
            {t("Fakturadato")}: {invoice.issueDate}
          </Text>
          <Text>
            {t("Forfaldsdato")}: {invoice.dueDate}
          </Text>
        </View>

        {invoice.customFields.length > 0 && (
          <View style={styles.customFieldsBlock}>
            {invoice.customFields.map((field, index) => (
              <View style={styles.customFieldRow} key={index}>
                <Text style={styles.customFieldLabel}>{t(field.label)}</Text>
                <Text>{field.value}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colDescription}>{t("Beskrivelse")}</Text>
            <Text style={styles.colQuantity}>{t("Antal")}</Text>
            <Text style={styles.colUnitPrice}>{t("Pris")}</Text>
            <Text style={styles.colTotal}>{t("I alt")}</Text>
          </View>
          {invoice.lineItems.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQuantity}>{item.quantity}</Text>
              <Text style={styles.colUnitPrice}>
                {item.unitPrice.toLocaleString(intl)} {invoice.currency}
              </Text>
              <Text style={styles.colTotal}>
                {(item.quantity * item.unitPrice).toLocaleString(intl)}{" "}
                {invoice.currency}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.muted}>{t("Subtotal")}</Text>
            <Text>
              {invoice.subtotalAmount.toLocaleString(intl)} {invoice.currency}
            </Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.muted}>
              {t("Moms (%{rate}%)", { rate: (invoice.vatRate * 100).toFixed(0) })}
            </Text>
            <Text>
              {invoice.vatAmount.toLocaleString(intl)} {invoice.currency}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalText}>{t("Total")}</Text>
            <Text style={styles.grandTotalText}>
              {invoice.totalAmount.toLocaleString(intl)} {invoice.currency}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
