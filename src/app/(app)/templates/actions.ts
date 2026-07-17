"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { customFieldsFromFormEntries } from "@/lib/custom-fields";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

const templateSchema = z.object({
  name: z.string().min(1, "Navn er påkrævet"),
});

export async function createTemplateAction(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const session = await requireSession();

  const parsed = templateSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Ugyldige oplysninger";
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
