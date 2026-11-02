"use client";

import { useRouter } from "next/navigation";
import type { FC } from "react";

import { Button } from "../../buttons/button";
import { Typography } from "../../display/typography";
import { Flex } from "../../layout/flex";
import { errorPageStyles } from "./styles";

export const ErrorPage: FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Flex className={errorPageStyles.element1} mt="lg">
      <Typography className={errorPageStyles.element2} variant="h2">
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1">
        We're sorry, but we couldn't process your request. Please try again or contact support if
        the problem persists.
      </Typography>
      <Button color="primary" onClick={handleGoBack} variant="default">
        Go Back
      </Button>
    </Flex>
  );
};
