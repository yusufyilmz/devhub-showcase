"use client";
import { type ImgHTMLAttributes, type SyntheticEvent, useEffect, useState } from "react";

import { createComponentLogger } from "@shared/utils/client-logger";

import type { AssetStrategy } from "@/shared/assets/types";

import { withCdnUrl } from "./assetUrls";

const logger = createComponentLogger("SmartImage");

export interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /**
   * URL of the image to load
   */
  src: string;

  /**
   * Width of the image in pixels
   */
  width?: number | string;

  /**
   * Height of the image in pixels
   */
  height?: number | string;

  /**
   * Loading strategy for images
   */
  strategy?: AssetStrategy;

  /**
   * Whether to show loading state
   */
  showLoading?: boolean;

  /**
   * Loading priority
   */
  priority?: boolean;

  /**
   * Whether to use offline cache first
   */
  offlineFirst?: boolean;

  /**
   * Placeholder to show while loading
   */
  placeholder?: "blur" | "empty" | "skeleton";

  /**
   * Blur data URL for blur placeholder
   */
  blurDataURL?: string;

  /**
   * Whether to show debug information
   */
  debug?: boolean;
}

/**
 * SmartImage component for optimized image loading with CDN and enhanced caching
 *
 * Features:
 * - Automatic CDN optimization for images via Next.js Image
 * - Fallback to enhanced caching for offline support
 * - Loading states and placeholders
 *
 * @example
 * ```tsx
 * <SmartImage
 *   src="https://rustykey.io:8080/images/hero.jpg"
 *   alt="Hero Image"
 *   width={800}
 *   height={600}
 * />
 * ```
 */
export function SmartImage({
  src,
  alt = "",
  width,
  height,
  className,
  style,
  strategy = "cdn",
  showLoading = true,
  priority = false,
  offlineFirst = false,
  placeholder = "empty",
  blurDataURL,
  debug = false,
  id,
  ...props
}: SmartImageProps) {
  // const { fetchAsset, ready } = useAssetWorker()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [enhancedSrc, setEnhancedSrc] = useState<string | null>(null);

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
  //         } else {
  //           setError(new Error('Invalid response format'))
  //         }
  //       })
  //       .catch((err) => {
  //         setError(err as Error)
  //         setLoading(false)
  //         logger.error('SmartImage [browser-cache] error:', { error: err })
  //       })
  //       .finally(() => {
  //         setLoading(false)
  //       })
  //   }
  // }, [strategy, enhancedSrc, ready, error, src, priority, fetchAsset])

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

  // Handle loading state
  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = (err: SyntheticEvent<HTMLImageElement, Event>) => {
    setError(new Error("Failed to load image"));
    setLoading(false);

    if (debug && process.env.NODE_ENV === "development") {
      logger.error("SmartImage error:", { error: err });
    }
  };

  // Show loading state if needed
  if (showLoading && loading) {
    if (placeholder === "skeleton") {
      return (
        <Skeleton
          variant="rectangular"
          width={width || "100%"}
          height={height || 200}
          animation="wave"
        />
      );
    }

    if (placeholder === "blur" && !blurDataURL) {
      return (
        <Box
          sx={{
            width: width || "100%",
            height: height || 200,
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

    // Default loading state (empty)
    return null;
  }

  // Show error state if needed
  if (error && !enhancedSrc) {
    return (
      <Box
        sx={{
          width: width || "100%",
          height: height || 200,
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
        {alt || "Image failed to load"}
      </Box>
    );
  }

  // Use regular img tag with enhanced src
  const imgComponent = (
    // biome-ignore lint/a11y/useAltText: <explanation>
    <img
      id={id}
      src={enhancedSrc || src}
      alt={alt || "Image"} // Ensure alt text is always provided
      className={className}
      style={{
        maxWidth: "100%",
        height: "auto",
        width: width ? `${width}px` : undefined,
        ...(height ? { height: `${height}px` } : {}),
        ...style,
      }}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );

  return imgComponent;
}

export default SmartImage;
