import type React from "react";

import { Button as LibraryButton } from "../../buttons/button/Button";
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
        <LibraryButton
          className={listItemStyles.element1}
          onClick={onClick}
          type="button"
          variant="unstyled"
        >
          {children}
        </LibraryButton>
      ) : (
        children
      )}
    </li>
  );
};
