"use client";

import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { Button } from "../button";

export const AddProjectButton = () => {
  const { push } = useRouter();

  return (
    <Button
      aria-label="Add project"
      onClick={() => push("/projects/add")}
      size="lg"
      startIcon={<Plus />}
      variant="default"
    >
      Add Project
    </Button>
  );
};
