import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Returns the current session's user, redirecting to /login if unauthenticated. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}
