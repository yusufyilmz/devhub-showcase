import {
  IconButtonWithLink,
  Tooltip,
  LinkedInIcon,
  EmailIcon,
  GitHubIcon,
  PhoneIcon
} from '@shared/ui/components'

export const SocialLinks = () => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <Tooltip content="LinkedIn" arrow>
        <IconButtonWithLink
          label="LinkedIn"
          href="https://www.linkedin.com/in/yusuf-yilmaz-01543752"
        >
          <LinkedInIcon fontSize="large" />
        </IconButtonWithLink>
      </Tooltip>

      <Tooltip content="Email" arrow>
        <IconButtonWithLink label="Email" href="mailto:yilmazyu@gmail.com">
          <EmailIcon fontSize="large" />
        </IconButtonWithLink>
      </Tooltip>

      <Tooltip content="GitHub" arrow>
        <IconButtonWithLink label="GitHub" href="https://github.com/yusufyilmz">
          <GitHubIcon fontSize="large" />
        </IconButtonWithLink>
      </Tooltip>
      <Tooltip content="Phone" arrow>
        <IconButtonWithLink label="Phone" href="tel:+34639464069">
          <PhoneIcon fontSize="large" />
        </IconButtonWithLink>
      </Tooltip>
    </div>
  )
}
