"use client";

import { copy } from "@shared/content";
import { useRouter } from "next/navigation";
import { Button } from "../../../components";

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <Button
      aria-label="Go back"
      variant="outlined"
      onClick={() => router.back()}
      className="rounded-lg"
    >
      {copy.cta.goBack}
    </Button>
  );
};
