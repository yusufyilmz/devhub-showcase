import { copy } from "@shared/config";

import { GoBackButton } from "../../buttons/go-back-button/GoBackButton";
import { NotFound } from "../../feedback/not-found";
import { recoveryPageStyles } from "../page-variants/styles";

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
