"use client";

import { useRouter } from "next/navigation";

import { Button } from "../Button";

export const AddProjectButton = () => {
  const { push } = useRouter();

  return (
    <Button aria-label="Add project" onClick={() => push("/projects/add")} variant="default">
      Add Project
    </Button>
  );
};
