import { createHash, randomBytes } from "node:crypto";
import { EMAIL_VERIFICATION_TOKEN_TTL_HOURS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}


export async function createVerificationToken(userId: string): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000,
  );

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { userId } }),
    prisma.verificationToken.create({
      data: { userId, tokenHash: hashToken(rawToken), expiresAt },
    }),
  ]);

  return rawToken;
}

export type ConsumeVerificationTokenResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "expired" };

export async function consumeVerificationToken(
  rawToken: string,
): Promise<ConsumeVerificationTokenResult> {
  const tokenHash = hashToken(rawToken);

  const token = await prisma.verificationToken.findUnique({
    where: { tokenHash },
  });

  if (!token) {
    return { ok: false, reason: "invalid" };
  }

  if (token.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { id: token.id } });
    return { ok: false, reason: "expired" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: token.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.deleteMany({ where: { userId: token.userId } }),
  ]);

  return { ok: true };
}
