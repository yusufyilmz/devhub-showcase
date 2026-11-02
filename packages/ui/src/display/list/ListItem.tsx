import type React from "react";

import { listItemClassName, listItemStyles } from "./styles";
import type { ListItemProps } from "./types";

export const ListItem: React.FC<ListItemProps> = ({
  children,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <li className={listItemClassName(className)} {...props}>
      {onClick ? (
        <button className={listItemStyles.element1} onClick={onClick} type="button">
          {children}
        </button>
      ) : (
        children
      )}
    </li>
  );
};
