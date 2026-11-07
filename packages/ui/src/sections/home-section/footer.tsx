import { ArrowUpRight } from "lucide-react";

import { Brand } from "../../navigation/brand";
import { Footer } from "../../navigation/footer/Footer";
import type { HomeFooterOptions } from "./types";

export function HomeFooter({ action }: HomeFooterOptions) {
  return (
    <Footer
      brand={<Brand />}
      credit={`© ${new Date().getFullYear()} MyDevStudio`}
      description="Build a portfolio and CV that grow with your work."
      groups={[
        {
          links: [
            { href: action.href, label: action.signedIn ? "Open studio" : "Sign in" },
            { href: "/#pricing", label: "Plans" },
          ],
          title: "Studio",
        },
        {
          links: [
            { href: "/#examples", label: "Portfolio examples" },
            { href: "/#features", label: "Studio features" },
            { href: "/#how-it-works", label: "How it works" },
          ],
          title: "Explore",
        },
        {
          links: [
            { href: "/#questions", label: "Common questions" },
            {
              external: true,
              href: "https://github.com/yusufyilmz/devhub-showcase",
              label: (
                <>
                  Source on GitHub <ArrowUpRight aria-hidden="true" size={14} />
                </>
              ),
            },
          ],
          title: "Resources",
        },
      ]}
    />
  );
}
