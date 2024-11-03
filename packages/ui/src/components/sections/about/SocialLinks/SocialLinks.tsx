import {
  IconButtonWithLink,
  Tooltip,
  LinkedInIcon,
  EmailIcon,
  GitHubIcon,
  PhoneIcon
} from '../../../../components'

export const SocialLinks = () => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <Tooltip title="LinkedIn" arrow>
        <IconButtonWithLink
          label="LinkedIn"
          href="https://www.linkedin.com/in/yusuf-yilmaz-01543752"
        >
          <LinkedInIcon fontSize="large" />
        </IconButtonWithLink>
      </Tooltip>

      <Tooltip title="Email" arrow>
        <IconButtonWithLink label="Email" href="mailto:yilmazyu@gmail.com">
          <EmailIcon fontSize="large" />
        </IconButtonWithLink>
      </Tooltip>

      <Tooltip title="GitHub" arrow>
        <IconButtonWithLink label="GitHub" href="https://github.com/yusufyilmz">
          <GitHubIcon fontSize="large" />
        </IconButtonWithLink>
      </Tooltip>
      <Tooltip title="Phone" arrow>
        <IconButtonWithLink label="Phone" href="tel:+34639464069">
          <PhoneIcon fontSize="large" />
        </IconButtonWithLink>
      </Tooltip>
    </div>
  )
}
