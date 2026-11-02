import { copy } from "@shared/config";

import { GoBackButton } from "../../buttons/buttons/GoBackButton";
import { HomeButton } from "../../buttons/buttons/HomeButton";
import { Typography } from "../../display/typography";
import { errorPageStyles } from "./styles";

export const ErrorPage = () => {
  return (
    <div className={errorPageStyles.element1}>
      <Typography className={errorPageStyles.element2} variant="h4">
        {copy.errorPage.title}
      </Typography>
      <Typography className={errorPageStyles.element3} variant="body1">
        {copy.errorPage.message}
      </Typography>
      <div className={errorPageStyles.element4}>
        <GoBackButton />
        <HomeButton />
      </div>
    </div>
  );
};
