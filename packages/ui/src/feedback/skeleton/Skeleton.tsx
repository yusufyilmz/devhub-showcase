import { cn } from "cn";

import { skeletonStyles } from "./styles";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(skeletonStyles.skeleton, className)} data-slot="skeleton" {...props} />;
}

export { Skeleton };
