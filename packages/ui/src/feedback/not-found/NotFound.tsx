import { cn } from "cn";

import { Button as LibraryButton } from "../../buttons/button/Button";
import { notFoundStyles } from "./styles";
import type { NotFoundProps } from "./types";

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
    <div className={cn(notFoundStyles.notFound, className)} {...props}>
      <div className={notFoundStyles.element1}>
        <div className={notFoundStyles.element2}>
          <h1 className={notFoundStyles.element3}>{title}</h1>
          <p className={notFoundStyles.element4}>{description}</p>
        </div>
        {LinkComponent ? (
          <LinkComponent className={buttonClasses} href={homeHref} to={homeHref}>
            {buttonText}
          </LinkComponent>
        ) : (
          <LibraryButton
            className={buttonClasses}
            onClick={onReturnHome}
            type="button"
            variant="unstyled"
          >
            {buttonText}
          </LibraryButton>
        )}
      </div>
    </div>
  );
}
