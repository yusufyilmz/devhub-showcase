import { SiteLoginScreen } from "./site-login-screen";

export function AdminLogin({
  initialError = "",
  errorCode,
}: {
  initialError?: string;
  errorCode?: string;
}) {
  return <SiteLoginScreen errorCode={errorCode} initialError={initialError} site="my-dev-studio" />;
}
