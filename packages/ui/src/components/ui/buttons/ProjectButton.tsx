import { Link } from '@mui/material'

export const ProjectButton = ({
  title,
  dark
}: {
  title: string
  dark?: boolean
}) => {
  return (
    <Link
      underline="none"
      href="#projects"
      className={`inline-block px-6 py-3 rounded-lg shadow transition ${
        dark
          ? 'bg-button-dark text-white hover:bg-gray-800'
          : 'bg-button-light text-black hover:bg-gray-300 hover:bg-button-hover text-buttonText'
      }`}
    >
      {title}
    </Link>
  )
}
