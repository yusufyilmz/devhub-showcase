import type React from "react";

import { listClassName } from "./styles";
import type { ListProps } from "./types";

const framedList = "overflow-y-auto overflow-x-hidden pl-2 rounded-lg shadow-md";

export const List: React.FC<ListProps> = ({
  children,
  className = "",
  divider = false,
  noBorder = true,
  listStyle = "disc",
}) => {
  return (
    <ul
      className={listClassName(
        noBorder ? "border-none shadow-none" : framedList,
        divider ? "divide-y divide-gray-200" : "",
        listStyle === "none" ? "" : `list-${listStyle}`,
        className,
      )}
    >
      {children}
    </ul>
  );
};
