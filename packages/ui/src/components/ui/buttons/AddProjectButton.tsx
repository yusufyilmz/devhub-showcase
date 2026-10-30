"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../../components";

export const AddProjectButton = () => {
  const { push } = useRouter();

  return (
    <Button
      aria-label="Add project"
      variant="contained"
      onClick={() => push("/projects/add")}
    >
      Add Project
    </Button>
  );
};
