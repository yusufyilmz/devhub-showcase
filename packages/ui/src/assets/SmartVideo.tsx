"use client";
import { useEffect, useState, type VideoHTMLAttributes } from "react";

import { Box, CircularProgress, Skeleton } from "@mui/material";

// import { withCdnUrl, withProxyUrl } from '../../rustykey/utils/rustyKey'
// import { useAssetWorker } from '../hooks/useAssetWorker'
import type { AssetStrategy } from "@/shared/assets/types";
import { createComponentLogger } from "@/shared/utils/logger";

import { withCdnUrl } from "./assetUrls";

const _logger = createComponentLogger("SmartVideo");

export interface SmartVideoProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  /**
   * URL of the video to load
   */
  src: string;

  /**
   * Width of the video in pixels
   */
  width?: number | string;

  /**
   * Height of the video in pixels
   */
  height?: number | string;

  /**
   * Whether to show loading state
   */
  showLoading?: boolean;

  /**
   * Loading priority
   */
  priority?: boolean;

  /**
   * Placeholder to show while loading
   */
  placeholder?: "empty" | "skeleton";

  /**
   * Whether to show debug information
   */
  debug?: boolean;

  /**
   * Loading strategy for videos
   */
  strategy?: AssetStrategy;
}

/**
 * SmartVideo component for optimized video loading with enhanced caching
 *
 * Features:
 * - Enhanced caching for offline support
 * - Loading states and placeholders
 * - Automatic blob URL creation for cached videos
 *
 * @example
 * ```tsx
 * <SmartVideo
 *   src="https://rustykey.io:8080/videos/hero.mp4"
 *   width={800}
 *   height={600}
 *   autoPlay
 *   loop
 *   muted
 * />
 * ```
 */
export function SmartVideo({
  src,
  width,
  height,
  showLoading = true,
  priority = false,
  placeholder = "empty",
  debug = false,
  strategy = "cdn",
  ...videoProps
}: SmartVideoProps) {
  const [loading, setLoading] = useState(!!src);
  const [error, setError] = useState<Error | null>(null);
  const [enhancedSrc, setEnhancedSrc] = useState<string | null>(null);

  // Strategy: cdn (direct URL with proxy)
  useEffect(() => {
    if (!src || enhancedSrc) {
      return;
    }

    if (strategy === "cdn") {
      const cdnUrl = withCdnUrl(src);
      setEnhancedSrc(cdnUrl);
      setLoading(false);
    } else {
      setEnhancedSrc(src);
      setLoading(false);
    }
  }, [strategy, src, enhancedSrc]);

  // Handle loading state
  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadedData = () => {
    setLoading(false);
  };

  const handleError = () => {
    setError(new Error("Failed to load video"));
    setLoading(false);
  };

  // Show loading state if needed
  if (showLoading && loading && !enhancedSrc) {
    if (placeholder === "skeleton") {
      return <Skeleton height={height || 200} variant="rectangular" width={width || "100%"} />;
    }

    // Default loading state (empty)
    return (
      <Box
        sx={{
          width: width || "100%",
          height: height || "1  00%",
          bgcolor: "grey.200",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  // Show error state if needed
  if (error && !enhancedSrc) {
    return (
      <Box
        sx={{
          width: width || "100%",
          height: height || "100%",
          bgcolor: "error.light",
          color: "error.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "caption.fontSize",
          p: 2,
          borderRadius: 1,
        }}
      >
        Video failed to load
      </Box>
    );
  }

  // Don't render if no src is available
  if (!enhancedSrc) {
    return null;
  }

  return (
    <video
      {...videoProps}
      src={enhancedSrc}
      width={width}
      height={height}
      style={{
        width: width || "100%",
        height: height || "100%",
        objectFit: "cover",
        ...videoProps.style,
      }}
      onLoadStart={handleLoadStart}
      onLoadedData={handleLoadedData}
      onError={handleError}
      autoPlay
      loop
      muted
      playsInline
    >
      Your browser does not support the video tag.
    </video>
  );
}
