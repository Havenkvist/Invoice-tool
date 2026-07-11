"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

const templateSchema = z.object({
  name: z.string().min(1, "Navn er påkrævet"),
  fields: z.string().optional(),
});

export async function createTemplateAction(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const session = await requireSession();

  const parsed = templateSchema.safeParse({
    name: formData.get("name"),
    fields: formData.get("fields") || undefined,
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Ugyldige oplysninger";
  }

  let fields: object = {};
  if (parsed.data.fields?.trim()) {
    try {
      fields = JSON.parse(parsed.data.fields);
    } catch {
      return "Felter skal være gyldig JSON";
    }
  }

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
