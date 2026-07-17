"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getTranslations } from "@/i18n/server";
import { customFieldsFromFormEntries } from "@/lib/custom-fields";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function createTemplateAction(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const session = await requireSession();
  const t = await getTranslations("errors");

  const templateSchema = z.object({
    name: z.string().min(1, t("Navn er påkrævet")),
  });

  const parsed = templateSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? t("Ugyldige oplysninger");
  }

  const fields = customFieldsFromFormEntries(
    formData.getAll("customFieldLabel"),
    formData.getAll("customFieldValue"),
  );

  await prisma.invoiceTemplate.create({
    data: {
      organizationId: session.user.organizationId,
      name: parsed.data.name,
      fields,
    },
  });

  revalidatePath("/templates");
  redirect("/templates");
}
