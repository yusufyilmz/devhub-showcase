import type * as React from "react";

import type { Button } from "../../buttons/button/Button";

export type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;
