import { hash } from "bcryptjs";
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { DANISH_STANDARD_VAT_RATE } from "../src/lib/constants";

config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SEED_PASSWORD = "password123";

async function main() {
  const passwordHash = await hash(SEED_PASSWORD, 10);

  const studio = await prisma.organization.create({
    data: {
      name: "Nordlys Fotostudie ApS",
      cvrNumber: "12345678",
      addressLine1: "Vesterbrogade 12",
      postalCode: "1620",
      city: "København V",
      users: {
        create: {
          email: "anna@nordlysfoto.dk",
          name: "Anna Sørensen",
          passwordHash,
          emailVerified: new Date(),
        },
      },
    },
  });

  const consulting = await prisma.organization.create({
    data: {
      name: "Bjerg Consulting",
      cvrNumber: "87654321",
      addressLine1: "Åboulevard 45",
      postalCode: "8000",
      city: "Aarhus C",
      users: {
        create: {
          email: "mikkel@bjergconsulting.dk",
          name: "Mikkel Bjerg",
          passwordHash,
          emailVerified: new Date(),
        },
      },
    },
  });

  const [clientA1, clientA2] = await Promise.all([
    prisma.client.create({
      data: {
        organizationId: studio.id,
        name: "Line & Thomas Jensen",
        email: "line.jensen@example.dk",
        addressLine1: "Nørrebrogade 90",
        postalCode: "2200",
        city: "København N",
      },
    }),
    prisma.client.create({
      data: {
        organizationId: studio.id,
        name: "Restaurant Havnen ApS",
        email: "kontakt@restauranthavnen.dk",
        cvrNumber: "23456789",
        addressLine1: "Havnegade 3",
        postalCode: "5000",
        city: "Odense C",
      },
    }),
  ]);

  const [clientB1] = await Promise.all([
    prisma.client.create({
      data: {
        organizationId: consulting.id,
        name: "Vestergaard Byg A/S",
        email: "regnskab@vestergaardbyg.dk",
        cvrNumber: "34567890",
        addressLine1: "Industrivej 8",
        postalCode: "7100",
        city: "Vejle",
      },
    }),
  ]);

  const weddingTemplate = await prisma.invoiceTemplate.create({
    data: {
      organizationId: studio.id,
      name: "Bryllupspakke",
      fields: { defaultNote: "Tak fordi I valgte Nordlys Fotostudie til jeres store dag." },
    },
  });

  // Studio: one issued invoice (consumes invoice number 1) and one draft.
  const issueDate1 = new Date("2026-06-01");
  const dueDate1 = new Date("2026-06-15");
  const lineItems1 = [
    { description: "Bryllupsfotografering, 8 timer", quantity: 1, unitPrice: 15000, position: 0 },
    { description: "Redigerede billeder, 200 stk.", quantity: 1, unitPrice: 4000, position: 1 },
  ];
  const subtotal1 = lineItems1.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const vat1 = subtotal1 * DANISH_STANDARD_VAT_RATE;

  await prisma.$transaction(async (tx) => {
    const org = await tx.organization.update({
      where: { id: studio.id },
      data: { nextInvoiceNumber: { increment: 1 } },
      select: { nextInvoiceNumber: true },
    });
    await tx.invoice.create({
      data: {
        organizationId: studio.id,
        clientId: clientA1.id,
        templateId: weddingTemplate.id,
        number: org.nextInvoiceNumber - 1,
        issueDate: issueDate1,
        dueDate: dueDate1,
        vatRate: DANISH_STANDARD_VAT_RATE,
        subtotalAmount: subtotal1,
        vatAmount: vat1,
        totalAmount: subtotal1 + vat1,
        status: "SENT",
        lineItems: { create: lineItems1 },
      },
    });
  });

  const draftLineItems = [
    { description: "Produktfotografering, halv dag", quantity: 1, unitPrice: 6000, position: 0 },
  ];
  const draftSubtotal = draftLineItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const draftVat = draftSubtotal * DANISH_STANDARD_VAT_RATE;

  await prisma.invoice.create({
    data: {
      organizationId: studio.id,
      clientId: clientA2.id,
      issueDate: new Date("2026-07-11"),
      dueDate: new Date("2026-07-25"),
      vatRate: DANISH_STANDARD_VAT_RATE,
      subtotalAmount: draftSubtotal,
      vatAmount: draftVat,
      totalAmount: draftSubtotal + draftVat,
      status: "DRAFT",
      lineItems: { create: draftLineItems },
    },
  });

  // Consulting: one issued, overdue invoice with a reminder already sent.
  const lineItems2 = [
    { description: "Strategirådgivning, 20 timer", quantity: 20, unitPrice: 1200, position: 0 },
  ];
  const subtotal2 = lineItems2.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const vat2 = subtotal2 * DANISH_STANDARD_VAT_RATE;

  await prisma.$transaction(async (tx) => {
    const org = await tx.organization.update({
      where: { id: consulting.id },
      data: { nextInvoiceNumber: { increment: 1 } },
      select: { nextInvoiceNumber: true },
    });
    const invoice = await tx.invoice.create({
      data: {
        organizationId: consulting.id,
        clientId: clientB1.id,
        number: org.nextInvoiceNumber - 1,
        issueDate: new Date("2026-05-01"),
        dueDate: new Date("2026-05-15"),
        vatRate: DANISH_STANDARD_VAT_RATE,
        subtotalAmount: subtotal2,
        vatAmount: vat2,
        totalAmount: subtotal2 + vat2,
        status: "OVERDUE",
        lineItems: { create: lineItems2 },
      },
    });
    await tx.reminder.create({
      data: {
        invoiceId: invoice.id,
        reminderNumber: 1,
        sentAt: new Date("2026-05-26"),
        feeAmount: 100,
      },
    });
  });

  console.log("Seed complete.");
  console.log(`Login as anna@nordlysfoto.dk / ${SEED_PASSWORD} (Nordlys Fotostudie)`);
  console.log(`Login as mikkel@bjergconsulting.dk / ${SEED_PASSWORD} (Bjerg Consulting)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
