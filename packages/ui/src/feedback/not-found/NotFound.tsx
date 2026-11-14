import { cn } from "cn";
import { Compass, House } from "lucide-react";

import { Button, buttonVariants } from "../../buttons/button/Button";
import { recoveryPageStyles } from "../../layout/page-variants/styles";
import type { NotFoundProps } from "./types";

export function NotFound({
  className,
  title = "Page not found",
  description = "This page may have moved or the address may have changed.",
  buttonText = "Return to website",
  onReturnHome,
  homeHref = "/",
  LinkComponent,
  secondaryAction,
  ...props
}: NotFoundProps) {
  const homeIcon = <House aria-hidden="true" />;

  return (
    <div className={cn(recoveryPageStyles.shell, className)} {...props}>
      <section className={cn(recoveryPageStyles.card, "group/recovery")}>
        <span className={cn(recoveryPageStyles.icon, "motion-safe:group-hover/recovery:rotate-12")}>
          <Compass aria-hidden="true" className="size-[1.375rem]" />
        </span>
        <p className={recoveryPageStyles.label}>Error 404</p>
        <h1 className={recoveryPageStyles.title}>{title}</h1>
        <p className={recoveryPageStyles.description}>{description}</p>
        <div className={recoveryPageStyles.actions}>
          {secondaryAction}
          {LinkComponent ? (
            <LinkComponent
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                recoveryPageStyles.button,
              )}
              href={homeHref}
              to={homeHref}
            >
              {homeIcon}
              {buttonText}
            </LinkComponent>
          ) : (
            <Button
              className={recoveryPageStyles.button}
              href={onReturnHome ? undefined : homeHref}
              onClick={onReturnHome}
              startIcon={homeIcon}
              variant="outline"
            >
              {buttonText}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
