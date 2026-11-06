"use client";
import { Box, SvgIcon } from "@mui/material";
import type { ImgHTMLAttributes } from "react";
import SmartImage from "./SmartImage";

export interface SmartIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /**
   * URL of the icon to load
   */
  src: string;

  /**
   * Size of the icon (both width and height)
   */
  size?: number | string;

  /**
   * Whether to use Next.js Image component (CDN) or enhanced caching
   */
  strategy?: "cdn" | "browser-cache";

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
   * Whether to show debug information
   */
  debug?: boolean;

  /**
   * Color to apply to the icon (for SVGs)
   */
  color?: string;

  /**
   * Placeholder to show while loading
   */
  placeholder?: "blur" | "empty" | "skeleton";
}

/**
 * SmartIcon component for optimized icon loading with enhanced caching
 *
 * Features:
 * - Optimized for SVG icons
 * - Enhanced caching for offline support
 * - Consistent sizing and coloring
 *
 * @example
 * ```tsx
 * <SmartIcon
 *   src="https://rustykey.io:8080/icons/menu.svg"
 *   alt="Menu"
 *   size={24}
 * />
 * ```
 */
export function SmartIcon({
  src,
  alt = "",
  size = 24,
  className,
  style,
  strategy = "cdn", // Default to enhanced for icons
  showLoading = true,
  priority = true, // Default to high priority for icons
  offlineFirst = true, // Default to offline-first for icons
  debug = false,
  color,
  ...props
}: SmartIconProps) {
  // For SVG icons, use enhanced strategy by default
  const isSvg = src.toLowerCase().endsWith(".svg");
  const finalStrategy = isSvg ? "cdn" : strategy;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: typeof size === "number" ? size : undefined,
        height: typeof size === "number" ? size : undefined,
        color: color,
        ...style,
      }}
      className={className}
    >
      <SmartImage
        src={src}
        alt={alt}
        width={typeof size === "number" ? size : undefined}
        height={typeof size === "number" ? size : undefined}
        strategy={finalStrategy}
        showLoading={showLoading}
        priority={priority}
        offlineFirst={offlineFirst}
        debug={debug}
        style={{
          width: typeof size === "number" ? size : undefined,
          height: typeof size === "number" ? size : undefined,
          objectFit: "contain",
        }}
        {...props}
      />
    </Box>
  );
}

/**
 * SmartSvgIcon component for SVG icons with Material-UI SvgIcon integration
 */
export function SmartSvgIcon({
  src,
  alt = "",
  size = 24,
  className,
  style,
  color = "inherit",
  ...props
}: SmartIconProps) {
  return (
    <SvgIcon
      component="div"
      sx={{
        width: typeof size === "number" ? size : undefined,
        height: typeof size === "number" ? size : undefined,
        color: color,
        ...style,
      }}
      className={className}
      {...props}
    >
      <SmartImage
        src={src}
        alt={alt}
        width={typeof size === "number" ? size : undefined}
        height={typeof size === "number" ? size : undefined}
        strategy="cdn"
        priority={true}
        offlineFirst={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </SvgIcon>
  );
}

export default SmartIcon;
