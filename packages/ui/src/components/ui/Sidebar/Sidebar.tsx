import Link from "next/link";

export const Sidebar = () => {
  return (
    <nav className="flex flex-col gap-6">
      <Link className="text-white text-xl hover:text-blue-400" href="/">
        Home
      </Link>
      <Link className="text-white text-xl hover:text-blue-400" href="/projects">
        Projects
      </Link>
      <Link className="text-white text-xl hover:text-blue-400" href="/about">
        About
      </Link>
      <Link className="text-white text-xl hover:text-blue-400" href="/contact">
        Contact
      </Link>
    </nav>
  );
};
