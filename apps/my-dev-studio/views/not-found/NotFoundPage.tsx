import { copy } from "@shared/config";
import { GoBackButton } from "@shared/ui/buttons";
import { recoveryPageStyles } from "@shared/ui/layout";
import { NotFound } from "@shared/ui/not-found";

export function NotFoundPage() {
  return (
    <NotFound
      buttonText={copy.cta.home}
      description={copy.notFoundPage.message}
      secondaryAction={<GoBackButton className={recoveryPageStyles.button} />}
      title={copy.notFoundPage.title}
    />
  );
}
