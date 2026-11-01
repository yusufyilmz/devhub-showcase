import { copy } from "@shared/config";

import { GoBackButton } from "../../buttons/buttons/GoBackButton";
import { HomeButton } from "../../buttons/buttons/HomeButton";
import { Typography } from "../../display/typography";

export const ErrorPage = () => {
  return (
    <div className="bg-main-primary flex flex-col gap-4 justify-center items-center w-p h-[calc(100vh-4rem)]">
      <Typography className="text-main-white" variant="h4">
        {copy.errorPage.title}
      </Typography>
      <Typography className="text-main-light-slate" variant="body1">
        {copy.errorPage.message}
      </Typography>
      <div className="flex gap-4 mb-4">
        <GoBackButton />
        <HomeButton />
      </div>
    </div>
  );
};
