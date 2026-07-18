import { cookies } from "next/headers";
import { DEFAULT_THEME, isTheme, THEME_COOKIE_NAME, type Theme } from "./config";

export async function getThemePreference(): Promise<Theme> {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE_NAME)?.value;
  return isTheme(value) ? value : DEFAULT_THEME;
}
