import {
  profile as fallback,
  getPortfolioCopy,
  type PortfolioProfile,
} from "@shared/content";
import {
  EmailIcon,
  GitHubIcon,
  IconButtonWithLink,
  LinkedInIcon,
  PhoneIcon,
  Tooltip,
} from "../../../../components";

export const SocialLinks = ({
  profile = fallback,
}: {
  profile?: PortfolioProfile;
}) => {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <div className="flex justify-center gap-4 mt-4">
      {profile.linkedin && (
        <Tooltip title="LinkedIn" arrow>
          <IconButtonWithLink label="LinkedIn" href={profile.linkedin}>
            <LinkedInIcon fontSize="large" />
          </IconButtonWithLink>
        </Tooltip>
      )}

      <Tooltip title={text.email} arrow>
        <IconButtonWithLink label={text.email} href={`mailto:${profile.email}`}>
          <EmailIcon fontSize="large" />
        </IconButtonWithLink>
      </Tooltip>

      {profile.github && (
        <Tooltip title="GitHub" arrow>
          <IconButtonWithLink label="GitHub" href={profile.github}>
            <GitHubIcon fontSize="large" />
          </IconButtonWithLink>
        </Tooltip>
      )}
      {profile.phone && (
        <Tooltip title={text.phone} arrow>
          <IconButtonWithLink
            label={text.phone}
            href={`tel:${profile.phone.replaceAll(" ", "")}`}
          >
            <PhoneIcon fontSize="large" />
          </IconButtonWithLink>
        </Tooltip>
      )}
    </div>
  );
};
