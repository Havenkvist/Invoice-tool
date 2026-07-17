-- AlterTable
ALTER TABLE "invoice_templates" ALTER COLUMN "fields" SET DEFAULT '[]';

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "customFields" SET DEFAULT '[]';
