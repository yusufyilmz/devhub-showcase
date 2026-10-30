import { Footer, Header } from "@shared/ui/components";
import { getPublishedProfile } from "../../lib/published-profile";
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getPublishedProfile();
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header profile={profile} />
      {children}
      <Footer profile={profile} />
    </>
  );
}
