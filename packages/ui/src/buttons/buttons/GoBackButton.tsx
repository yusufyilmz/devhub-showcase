"use client";

import { useRouter } from "next/navigation";

import { copy } from "@shared/config";

import { Button } from "../button";
import { goBackButtonStyles } from "./styles";

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <Button
      aria-label="Go back"
      className={goBackButtonStyles.element1}
      onClick={() => router.back()}
      variant="outline"
    >
      {copy.cta.goBack}
    </Button>
  );
};
