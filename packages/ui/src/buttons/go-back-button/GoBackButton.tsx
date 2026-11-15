"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { copy } from "@shared/config";

import { Button } from "../button";

export const GoBackButton = ({ className }: { className?: string } = {}) => {
  const router = useRouter();

  return (
    <Button
      aria-label="Go back"
      className={className}
      onClick={() => router.back()}
      startIcon={<ArrowLeft />}
      variant="outline"
    >
      {copy.cta.goBack}
    </Button>
  );
};
