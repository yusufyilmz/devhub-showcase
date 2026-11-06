"use client";
import { type ReactNode, useEffect, useState } from "react";

import { createComponentLogger } from "@shared/utils/client-logger";

import { Skeleton } from "../feedback";
import { withCdnUrl } from "./assetUrls";
import { IMAGES } from "./constants";
import type { AssetStrategy } from "./types";

const _logger = createComponentLogger("SmartAvatar");

export interface SmartAvatarProps extends Omit<AvatarProps, "src"> {
  /**
   * URL of the avatar to load
   * If userId is provided, this is ignored
   */
  src?: string;

  /**
   * Alternative text for the avatar
   */
  alt?: string;

  /**
   * Whether to use offline cache first
   */
  offlineFirst?: boolean;

  /**
   * Loading priority
   */
  priority?: boolean;

  /**
   * Whether to show debug information
   */
  debug?: boolean;

  /**
   * Whether to show loading state
   */
  showLoading?: boolean;

  /**
   * Fallback content when avatar fails to load or no src is provided
   * If not provided, will use the first letter of alt text
   */
  fallback?: ReactNode;

  /**
   * Whether to show tooltip with user information
   */
  showTooltip?: boolean;

  /**
   * Tooltip title content
   */
  tooltipTitle?: ReactNode;

  /**
   * Loading strategy for avatars
   */
  strategy?: AssetStrategy;
}

/**
 * SmartAvatar component for optimized avatar loading with caching and offline support
 *
 * Features:
 * - Automatic caching with enhanced asset worker
 * - Offline-first capability
 * - Fallback to default avatar or initials
 * - Tooltip support for user information
 * - Development tooltips for debugging
 * - Direct userId support for standard avatar URLs
 *
 * @example
 * ```tsx
 * // Using direct userId (recommended)
 * <SmartAvatar
 *   userId={123}
 *   alt="User Name"
 * />
 *
 */
export function SmartAvatar({
  src,
  alt = "",
  offlineFirst = true, // Default to offline-first for avatars
  priority = true, // Default to high priority for avatars
  debug = false,
  showLoading = true,
  fallback,
  showTooltip = false,
  tooltipTitle,
  strategy = "cdn",
  ...props
}: SmartAvatarProps) {
  const [enhancedSrc, setEnhancedSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!src);
  const [error, _setError] = useState<Error | null>(null);

  // Use default avatar if no src or userId is provided
  const defaultAvatar = IMAGES.avatar?.url || "";

  // Strategy: cdn (direct URL with proxy)
  useEffect(() => {
    if (!src || enhancedSrc) {
      return;
    }

    if (strategy === "cdn") {
      const cdnUrl = withCdnUrl(src);
      setEnhancedSrc(cdnUrl);
      setLoading(false);
    }

    // if (strategy === 'proxy') {
    //   const cdnUrl = withProxyUrl(src)
    //   setEnhancedSrc(cdnUrl)
    //   setLoading(false)
    // }
  }, [strategy, src, enhancedSrc]);

  // // Strategy: browser-cache (uses asset worker for blob URLs)
  // useEffect(() => {
  //   if (strategy === 'browser-cache' && !enhancedSrc && ready && !error && src) {
  //     const optimizedUrl = withProxyUrl(src)
  //     fetchAsset(optimizedUrl, 'image', {
  //       priority: priority ? 'high' : 'medium',
  //     })
  //       .then((response) => {
  //         if (typeof response === 'string') {
  //           setEnhancedSrc(response) // This will be a blob URL string
  //           setLoading(false)
  //         } else {
  //           setError(new Error('Invalid response format'))
  //         }
  //       })
  //       .catch((err) => {
  //         setError(err as Error)
  //         setLoading(false)
  //         logger.error('SmartAvatar [browser-cache] error:', { error: err })
  //       })
  //   }
  // }, [strategy, enhancedSrc, ready, error, src, priority, fetchAsset])

  // Generate initials from alt text if no fallback is provided
  const getInitials = () => {
    if (!alt) return "?";

    const nameParts = alt.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  if (!enhancedSrc || loading) {
    return <Skeleton shape={"circle"} />;
  }

  // Prepare the avatar component
  const avatarComponent = (
    <Avatar
      src={enhancedSrc || (src && !error ? src : error ? defaultAvatar : undefined)}
      size={props.size}
      {...props}
    >
      {!src || error ? fallback || getInitials() : null}
    </Avatar>
  );

  // // In production, only show tooltip if requested
  // if (showTooltip && tooltipTitle) {
  //   return (
  //     <Tooltip title={tooltipTitle} arrow placement="top">
  //       <Box component="span" sx={{ display: 'inline-block' }}>
  //         {avatarComponent}
  //       </Box>
  //     </Tooltip>
  //   )
  // }

  return avatarComponent;
}

export default SmartAvatar;
