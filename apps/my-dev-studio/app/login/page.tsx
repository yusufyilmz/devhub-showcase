import type { Metadata } from "next";

import { ThemeToggle } from "@shared/ui/components";
import { SiteLoginScreen } from "@shared/ui/site-login";

import { localTestLoginEnabled } from "@/features/admin/local-test-login";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <SiteLoginScreen
      brandActions={<ThemeToggle />}
      errorCode={error}
      localTestLogin={localTestLoginEnabled()}
      site="my-dev-studio"
    />
  );
}
