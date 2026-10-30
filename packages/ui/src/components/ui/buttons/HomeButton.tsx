"use client";

import { Button } from "@shared/components";
import { copy } from "@shared/content";
import { useRouter } from "next/navigation";

export const HomeButton = () => {
  const { replace } = useRouter();

  return (
    <Button
      aria-label="Go to home"
      className="rounded-lg"
      onClick={() => replace("/")}
      variant="outlined"
    >
      {copy.cta.home}
    </Button>
  );
};
