import type { ReactNode } from "react";

export function LoginTitle({
  lines,
  emphasis = "none",
}: {
  lines: readonly [string, string];
  emphasis?: "none" | "second";
}): ReactNode {
  return (
    <>
      {lines[0]}
      <br />
      {emphasis === "second" ? <span>{lines[1]}</span> : lines[1]}
    </>
  );
}
