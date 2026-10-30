import type React from "react";

type IconButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  color?: string;
  size?: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  color = "text-gray-600",
  size = "w-6 h-6",
  className = "",
  children,
  ariaLabel,
  ...props
}) => {
  return (
    <button
      aria-label={ariaLabel}
      className={`p-2 rounded-full focus:outline-hidden ${color} ${className}`}
      onClick={onClick}
      type="button"
      {...props}
    >
      <div className={size}>{children}</div>
    </button>
  );
};

type IconButtonWithLinkProps = {
  href: string;
  children: React.ReactNode;
  label: string;
  className?: string;
};

export const IconButtonWithLink: React.FC<IconButtonWithLinkProps> = ({
  href,
  children,
  label,
  className,
}) => {
  return (
    <a
      aria-label={label}
      className={`social-link ${className ?? ""}`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
};
