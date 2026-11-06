import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Flex, FlexCenter, FlexCol } from "../../layout";
import { Typography } from "../typography";

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      xs: "h-6 w-6",
      sm: "h-8 w-8",
      default: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
      "2xl": "h-20 w-20",
    },
    variant: {
      default: "bg-[var(--muted)] text-[var(--muted-foreground)]",
      primary: "bg-[var(--primary)] text-[var(--primary-foreground)]",
      secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
      accent: "bg-[var(--accent)] text-[var(--accent-foreground)]",
      success: "bg-[var(--success)] text-[var(--success-foreground)]",
      warning: "bg-[var(--warning)] text-[var(--warning-foreground)]",
      destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)]",
      info: "bg-[var(--info)] text-[var(--info-foreground)]",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  showStatus?: boolean;
  status?: "online" | "offline" | "away" | "busy";
  statusColor?: "default" | "success" | "warning" | "destructive" | "info";
}

export function AvatarVariants({
  className,
  size,
  variant,
  src,
  alt,
  fallback,
  showStatus = false,
  status = "online",
  statusColor = "default",
  children,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const [_imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const statusColors = {
    online: "bg-[var(--success)]",
    offline: "bg-[var(--muted)]",
    away: "bg-[var(--warning)]",
    busy: "bg-[var(--destructive)]",
  };

  const statusSizeClasses = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    default: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
    "2xl": "w-5 h-5",
  };

  return (
    <Flex className={cn(avatarVariants({ size, variant }), className)} {...props}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
        <FlexCenter className="h-full w-full">
          <Typography variant="body2" className="text-sm font-medium text-[var(--foreground)]">
            {fallback ? getInitials(fallback) : children}
          </Typography>
        </FlexCenter>
      )}

      {showStatus && (
        <Flex
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-[var(--background)]",
            statusColors[status],
            statusSizeClasses[size || "default"],
          )}
        />
      )}
    </Flex>
  );
}

// Convenience components for common avatar patterns
export function UserAvatar({
  name,
  email,
  src,
  size = "default",
  showStatus = false,
  status = "online",
  ...props
}: {
  name: string;
  email?: string;
  src?: string;
  size?: AvatarProps["size"];
  showStatus?: boolean;
  status?: AvatarProps["status"];
} & Omit<AvatarProps, "fallback" | "alt">) {
  return (
    <AvatarVariants
      src={src}
      alt={name}
      fallback={name}
      size={size}
      showStatus={showStatus}
      status={status}
      {...props}
    />
  );
}

export function GroupAvatar({
  users,
  size = "default",
  maxVisible = 3,
  ...props
}: {
  users: Array<{ name: string; src?: string }>;
  size?: AvatarProps["size"];
  maxVisible?: number;
} & Omit<AvatarProps, "children">) {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  if (users.length === 1) {
    return <AvatarVariants src={users[0].src} fallback={users[0].name} size={size} {...props} />;
  }

  return (
    <Flex className="-space-x-2">
      {visibleUsers.map((user, index) => (
        <AvatarVariants
          key={index}
          src={user.src}
          fallback={user.name}
          size={size}
          className="border-2 border-[var(--background)]"
          {...props}
        />
      ))}
      {remainingCount > 0 && (
        <FlexCenter
          className={cn(
            "rounded-full border-2 border-[var(--background)] bg-[var(--muted)] text-xs font-medium",
            avatarVariants({ size }),
          )}
        >
          <Typography
            variant="caption"
            className="text-xs font-medium text-[var(--muted-foreground)]"
          >
            +{remainingCount}
          </Typography>
        </FlexCenter>
      )}
    </Flex>
  );
}

export function AvatarWithText({
  name,
  description,
  src,
  size = "default",
  showStatus = false,
  status = "online",
  ...props
}: {
  name: string;
  description?: string;
  src?: string;
  size?: AvatarProps["size"];
  showStatus?: boolean;
  status?: AvatarProps["status"];
} & Omit<AvatarProps, "fallback" | "alt">) {
  return (
    <Flex align="center" gap="sm" className="gap-3">
      <AvatarVariants
        src={src}
        fallback={name}
        size={size}
        showStatus={showStatus}
        status={status}
        {...props}
      />
      <FlexCol className="flex-1 min-w-0">
        <Typography variant="body2" className="font-medium text-[var(--foreground)] truncate">
          {name}
        </Typography>
        {description && (
          <Typography variant="caption" className="text-[var(--muted-foreground)] truncate">
            {description}
          </Typography>
        )}
      </FlexCol>
    </Flex>
  );
}
