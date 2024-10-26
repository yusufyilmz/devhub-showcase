import Link from 'next/link'

export const Sidebar = () => {
  return (
    <nav className="flex flex-col space-y-6">
      <Link href="/" className="text-white text-xl hover:text-blue-400">
        Home
      </Link>
      <Link href="/projects" className="text-white text-xl hover:text-blue-400">
        Projects
      </Link>
      <Link href="/about" className="text-white text-xl hover:text-blue-400">
        About
      </Link>
      <Link href="/contact" className="text-white text-xl hover:text-blue-400">
        Contact
      </Link>
    </nav>
  )
}
