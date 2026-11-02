import Link from "next/link";

import { projectButtonClassName } from "./styles";
import type { ProjectButtonOptions } from "./types";

export const ProjectButton = ({ title, dark }: ProjectButtonOptions) => {
  return (
    <Link
      className={projectButtonClassName(
        dark
          ? "bg-button-primary text-white hover:bg-gray-800"
          : "bg-button-light text-black hover:bg-gray-300 hover:bg-button-hover text-buttonText",
      )}
      href="#projects"
    >
      {title}
    </Link>
  );
};
