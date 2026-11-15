"use client";

import { useRouter } from "next/navigation";

import { House } from "lucide-react";

import { copy } from "@shared/config";

import { Button } from "../button";

export const HomeButton = ({ className }: { className?: string } = {}) => {
  const { replace } = useRouter();

  return (
    <Button
      aria-label="Go to home"
      className={className}
      onClick={() => replace("/")}
      startIcon={<House />}
      variant="outline"
    >
      {copy.cta.home}
    </Button>
  );
};
