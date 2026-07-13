import { createHash, randomBytes } from "node:crypto";
import { EMAIL_VERIFICATION_TOKEN_TTL_HOURS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Creates a new email verification token for a user and returns the RAW
 * token (only ever held in memory / the emailed link — the database stores
 * just its hash, the same way a password is stored).
 */
export async function createVerificationToken(userId: string): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000,
  );

  // A user retrying signup/resend shouldn't accumulate old, still-valid
  // tokens — only the newest link should work.
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

/** Verifies a raw token from a verification link and marks the user verified. */
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
