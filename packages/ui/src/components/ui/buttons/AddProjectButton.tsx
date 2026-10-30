"use client";

import { Button } from "@shared/components";
import { useRouter } from "next/navigation";

export const AddProjectButton = () => {
  const { push } = useRouter();

  return (
    <Button aria-label="Add project" onClick={() => push("/projects/add")} variant="contained">
      Add Project
    </Button>
  );
};
