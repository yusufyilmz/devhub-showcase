import { profile as fallback, getPortfolioCopy } from "@shared/config";
import { IconButtonWithLink } from "@shared/ui/icon-button";
import { EmailIcon, GitHubIcon, LinkedInIcon, PhoneIcon } from "@shared/ui/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/ui/tooltip";

import { socialLinksStyles } from "./styles";
import type { SocialLinksOptions } from "./types";

export const SocialLinks = ({ profile = fallback }: SocialLinksOptions) => {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <div className={socialLinksStyles.element1}>
      {profile.linkedin && (
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButtonWithLink href={profile.linkedin} label="LinkedIn">
              <LinkedInIcon fontSize="large" />
            </IconButtonWithLink>
          </TooltipTrigger>
          <TooltipContent>LinkedIn</TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <IconButtonWithLink href={`mailto:${profile.email}`} label={text.email}>
            <EmailIcon fontSize="large" />
          </IconButtonWithLink>
        </TooltipTrigger>
        <TooltipContent>{text.email}</TooltipContent>
      </Tooltip>

      {profile.github && (
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButtonWithLink href={profile.github} label="GitHub">
              <GitHubIcon fontSize="large" />
            </IconButtonWithLink>
          </TooltipTrigger>
          <TooltipContent>GitHub</TooltipContent>
        </Tooltip>
      )}
      {profile.phone && (
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButtonWithLink
              href={`tel:${profile.phone.replaceAll(" ", "")}`}
              label={text.phone}
            >
              <PhoneIcon fontSize="large" />
            </IconButtonWithLink>
          </TooltipTrigger>
          <TooltipContent>{text.phone}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
