import { SiteLoginScreen } from "@shared/auth/components";
import { ThemeToggle } from "@shared/ui/theme";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return <SiteLoginScreen brandActions={<ThemeToggle />} errorCode={error} site="my-fitness-app" />;
}
