"use client";

import { useRouter } from "next/navigation";

import { copy } from "@shared/config";

import { Button } from "../button";
import { homeButtonStyles } from "./styles";

export const HomeButton = () => {
  const { replace } = useRouter();

  return (
    <Button
      aria-label="Go to home"
      className={homeButtonStyles.element1}
      onClick={() => replace("/")}
      variant="outline"
    >
      {copy.cta.home}
    </Button>
  );
};
