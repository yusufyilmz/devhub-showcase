"use client";

import { useRouter } from "next/navigation";

import { copy } from "@shared/config";

import { Button } from "../button";

export const HomeButton = () => {
  const { replace } = useRouter();

  return (
    <Button
      aria-label="Go to home"
      className="rounded-lg"
      onClick={() => replace("/")}
      variant="outline"
    >
      {copy.cta.home}
    </Button>
  );
};
