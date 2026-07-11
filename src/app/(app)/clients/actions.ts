"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

const clientSchema = z.object({
  name: z.string().min(1, "Navn er påkrævet"),
  email: z.string().email("Ugyldig email"),
  cvrNumber: z.string().trim().optional(),
  addressLine1: z.string().min(1, "Adresse er påkrævet"),
  addressLine2: z.string().trim().optional(),
  postalCode: z.string().min(1, "Postnummer er påkrævet"),
  city: z.string().min(1, "By er påkrævet"),
});

export async function createClientAction(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const session = await requireSession();

  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    cvrNumber: formData.get("cvrNumber") || undefined,
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2") || undefined,
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Ugyldige oplysninger";
  }

  await prisma.client.create({
    data: {
      organizationId: session.user.organizationId,
      name: parsed.data.name,
      email: parsed.data.email,
      cvrNumber: parsed.data.cvrNumber || null,
      addressLine1: parsed.data.addressLine1,
      addressLine2: parsed.data.addressLine2 || null,
      postalCode: parsed.data.postalCode,
      city: parsed.data.city,
    },
  });

  revalidatePath("/clients");
  redirect("/clients");
}
