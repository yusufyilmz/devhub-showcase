import type React from "react";
import type { ReactNode } from "react";

interface ListItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  children,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <li
      className={`p-2 cursor-pointer transition duration-200 ${className}`}
      {...props}
    >
      {onClick ? (
        <button type="button" onClick={onClick} className="w-full text-left">
          {children}
        </button>
      ) : (
        children
      )}
    </li>
  );
};
