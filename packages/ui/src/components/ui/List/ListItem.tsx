import type React from "react";
import type { ReactNode } from "react";

interface ListItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  children,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <li className={`p-2 cursor-pointer transition duration-200 ${className}`} {...props}>
      {onClick ? (
        <button className="w-full text-left" onClick={onClick} type="button">
          {children}
        </button>
      ) : (
        children
      )}
    </li>
  );
};
