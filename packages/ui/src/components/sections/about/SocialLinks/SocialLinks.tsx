import { IconButton, Tooltip, Box } from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'
import PhoneIcon from '@mui/icons-material/Phone'

export const SocialLinks = () => {
  return (
    <Box display="flex" justifyContent="center" gap={2} mt={4}>
      <Tooltip title="LinkedIn" arrow>
        <IconButton
          aria-label="LinkedIn"
          className="icon-button"
          color="primary"
          href="https://www.linkedin.com/in/yusuf-yilmaz-01543752"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Email" arrow>
        <IconButton
          aria-label="Email"
          color="primary"
          href="mailto:yilmazyu@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-button"
        >
          <EmailIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="GitHub" arrow>
        <IconButton
          aria-label="GitHub"
          color="primary"
          href="https://github.com/yusufyilmz"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-button"
        >
          <GitHubIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Phone" arrow>
        <IconButton
          aria-label="Phone"
          color="primary"
          className="icon-button"
          href="tel:+34639464069"
        >
          <PhoneIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}