import type React from "react";

import { listClassName } from "./styles";
import type { ListProps } from "./types";

export const List: React.FC<ListProps> = ({ children, className = "", divider = false }) => {
  return (
    <ul className={listClassName(divider ? "divide-y divide-gray-200" : "", className)}>
      {children}
    </ul>
  );
};
