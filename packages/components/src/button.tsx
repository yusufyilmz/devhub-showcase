"use client";
import type React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "contained" | "text" | "outlined" | "primary" | "secondary" | "disabled";
  onClick?: () => void;
  fullWidth?: boolean;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  endIcon?: React.ReactNode;
  disabled?: boolean;
} & (React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>);

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "contained",
  onClick,
  fullWidth = false,
  className = "",
  href,
  target,
  rel,
  endIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-semibold focus:outline-hidden transition ease-in-out duration-300";

  const variants = {
    contained: "bg-main-primary hover:bg-backgroundColor-buttonHover text-textColor-white",
    disabled: "bg-backgroundColor-gray text-textColor-slate cursor-not-allowed",
    outlined:
      "border border-borderColor-button text-backgroundColor-button hover:bg-main-dark-hover",
    primary: "bg-main-primary hover:bg-backgroundColor-buttonHover text-textColor-white",
    secondary: "bg-main-secondary hover:bg-main-dark-slate text-textColor-white",
    text: "bg-transparent text-main-lightSlate hover:bg-main-dark-hover",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const buttonStyles = `${baseStyles} ${disabled ? variants.disabled : variants[variant]} ${widthStyle} hover:scale-105 shine-effect ${className}`;

  const Component = href ? "a" : "button";

  return (
    <Component
      className={buttonStyles}
      disabled={disabled}
      href={href}
      onClick={onClick}
      rel={rel}
      target={target}
      {...props}
    >
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </Component>
  );
};

export { Button };
