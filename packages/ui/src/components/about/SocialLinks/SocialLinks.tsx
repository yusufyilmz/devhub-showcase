import { IconButton, Tooltip, Box } from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'
import InstagramIcon from '@mui/icons-material/Instagram'
import PhoneIcon from '@mui/icons-material/Phone'

export const SocialLinks = () => {
  return (
    <Box display="flex" justifyContent="center" gap={2} mt={4}>
      <Tooltip title="LinkedIn" arrow>
        <IconButton
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
          color="primary"
          href="mailto:yilmazyu@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <EmailIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="GitHub" arrow>
        <IconButton
          color="primary"
          href="https://github.com/yusufyilmz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Instagram" arrow>
        <IconButton
          color="primary"
          href="https://www.instagram.com/yusufyilmz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Phone" arrow>
        <IconButton
          color="primary"
          href="tel:+34639464069"
        >
          <PhoneIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
