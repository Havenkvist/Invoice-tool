import { headers } from "next/headers";

/** Origin of the current request (e.g. "http://localhost:3000"), for building absolute links in emails. */
export async function getRequestOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}
