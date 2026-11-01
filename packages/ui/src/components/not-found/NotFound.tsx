import type * as React from "react";

import { cn } from "cn";

interface NotFoundProps {
  buttonText?: string;
  className?: string;
  description?: string;
  homeHref?: string;
  LinkComponent?: React.ComponentType<any>;
  onReturnHome?: () => void;
  title?: string;
}

export function NotFound({
  className,
  title = "404",
  description = "Looks like you've ventured into the unknown digital realm.",
  buttonText = "Return to website",
  onReturnHome,
  homeHref = "/",
  LinkComponent,
  ...props
}: NotFoundProps) {
  const buttonClasses =
    "inline-flex h-10 items-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300";

  return (
    <div
      className={cn(
        "flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16",
        className,
      )}
      {...props}
    >
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl transition-transform hover:scale-110">
            {title}
          </h1>
          <p className="text-gray-500">{description}</p>
        </div>
        {LinkComponent ? (
          <LinkComponent className={buttonClasses} href={homeHref} to={homeHref}>
            {buttonText}
          </LinkComponent>
        ) : (
          <button className={buttonClasses} onClick={onReturnHome} type="button">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
