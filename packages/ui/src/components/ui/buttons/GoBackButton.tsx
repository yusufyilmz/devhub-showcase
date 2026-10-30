"use client";

import { Button } from "@shared/components";
import { copy } from "@shared/content";
import { useRouter } from "next/navigation";

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <Button
      aria-label="Go back"
      className="rounded-lg"
      onClick={() => router.back()}
      variant="outlined"
    >
      {copy.cta.goBack}
    </Button>
  );
};
