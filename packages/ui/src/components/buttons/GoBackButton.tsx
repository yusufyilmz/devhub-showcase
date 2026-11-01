"use client";

import { useRouter } from "next/navigation";

import { copy } from "@shared/config";

import { Button } from "../Button";

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <Button
      aria-label="Go back"
      className="rounded-lg"
      onClick={() => router.back()}
      variant="outline"
    >
      {copy.cta.goBack}
    </Button>
  );
};
