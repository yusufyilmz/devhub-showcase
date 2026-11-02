import type { Metadata } from "next";

import { SiteLoginScreen } from "@shared/auth/components";
import { ThemeToggle } from "@shared/ui/components";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return <SiteLoginScreen brandActions={<ThemeToggle />} errorCode={error} site="my-dev-studio" />;
}
