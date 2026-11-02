import { copy } from "@shared/config";

import { GoBackButton } from "../../buttons/buttons/GoBackButton";
import { HomeButton } from "../../buttons/buttons/HomeButton";
import { Typography } from "../../display/typography";
import { notFoundPageStyles } from "./styles";

export const NotFoundPage = () => {
  return (
    <div className={notFoundPageStyles.element1}>
      <Typography className={notFoundPageStyles.element2} variant="h4">
        {copy.notFoundPage.title}
      </Typography>
      <Typography className={notFoundPageStyles.element3} variant="body1">
        {copy.notFoundPage.message}
      </Typography>
      <div className={notFoundPageStyles.element4}>
        <GoBackButton />
        <HomeButton />
      </div>
    </div>
  );
};
