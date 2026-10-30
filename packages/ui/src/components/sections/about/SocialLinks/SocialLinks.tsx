import { Tooltip } from "@mui/material";
import { profile as fallback, getPortfolioCopy, type PortfolioProfile } from "@shared/content";

import { IconButtonWithLink } from "../../../ui/IconButton/IconButton";
import { EmailIcon, GitHubIcon, LinkedInIcon, PhoneIcon } from "../../../ui/Icons/Icons";

export const SocialLinks = ({ profile = fallback }: { profile?: PortfolioProfile }) => {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <div className="flex justify-center gap-4 mt-4">
      {profile.linkedin && (
        <Tooltip arrow title="LinkedIn">
          <IconButtonWithLink href={profile.linkedin} label="LinkedIn">
            <LinkedInIcon fontSize="large" />
          </IconButtonWithLink>
        </Tooltip>
      )}

      <Tooltip arrow title={text.email}>
        <IconButtonWithLink href={`mailto:${profile.email}`} label={text.email}>
          <EmailIcon fontSize="large" />
        </IconButtonWithLink>
      </Tooltip>

      {profile.github && (
        <Tooltip arrow title="GitHub">
          <IconButtonWithLink href={profile.github} label="GitHub">
            <GitHubIcon fontSize="large" />
          </IconButtonWithLink>
        </Tooltip>
      )}
      {profile.phone && (
        <Tooltip arrow title={text.phone}>
          <IconButtonWithLink href={`tel:${profile.phone.replaceAll(" ", "")}`} label={text.phone}>
            <PhoneIcon fontSize="large" />
          </IconButtonWithLink>
        </Tooltip>
      )}
    </div>
  );
};
