"use client";
import { createComponentLogger } from "@/shared/utils/logger";
import Image from "next/image";
import { useState } from "react";
import type { SmartAssetProps } from "@/assets/types";
import { getAssetType, isValidAssetUrl } from "@/assets/utils/assetUrls";

const logger = createComponentLogger("SmartAsset");

/**
 * Smart Asset Component that automatically chooses the best loading strategy:
 * - CDN (Next.js Image): For images that benefit from optimization and CDN
 * - Enhanced Caching: For JSON, icons, and assets needing offline support
 * - Auto: Intelligent selection based on asset type and requirements
 */
export const SmartAsset = ({
  src,
  alt = "",
  width,
  height,
  priority = false,
  className,
  style,
  sizes,
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  strategy = "auto",
}: SmartAssetProps) => {
  const [cdnError, setCdnError] = useState(false);

  // Determine the best strategy
  const getStrategy = (): "cdn" | "enhanced" => {
    if (strategy !== "auto") return strategy;

    const assetType = getAssetType(src);

    // Use CDN for images that benefit from Next.js optimization
    if (assetType === "image" && !src.endsWith(".svg") && isValidAssetUrl(src)) {
      return "cdn";
    }

    // Use enhanced caching for everything else
    return "enhanced";
  };

  const selectedStrategy = getStrategy();

  // CDN Strategy (Next.js Image)
  if (selectedStrategy === "cdn" && !cdnError) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width || 0}
        height={height || 0}
        priority={priority}
        className={className}
        style={style}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={() => {
          logger.warn(`CDN failed for ${src}, falling back to enhanced caching`);
          setCdnError(true);
        }}
        onLoad={() => {
          logger.info(`✅ CDN loaded: ${src}`);
        }}
      />
    );
  }

  // Enhanced Caching Strategy - simplified for now
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        maxWidth: "100%",
        height: "auto",
        ...style,
      }}
      loading={priority ? "eager" : "lazy"}
      width={width}
      height={height}
    />
  );
};
