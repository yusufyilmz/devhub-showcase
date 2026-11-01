"use client";

import { useRouter } from "next/navigation";
import type { FC } from "react";

import { Button } from "../button";
import { Flex } from "../flex";
import { Typography } from "../typography";

export const ErrorPage: FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Flex className="text-center" mt="lg">
      <Typography className="text-destructive" variant="h2">
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
