"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Skeleton } from "../feedback";
import { withCdnUrl } from "./assetUrls";
import type { AssetStrategy } from "./types";

// /**
//  * Enhanced Logo component that demonstrates the hybrid CDN + Enhanced caching approach
//  *
//  * This replaces the existing Logo component and shows:
//  * - Automatic strategy selection
//  * - Fallback handling
//  * - Performance optimization
//  * - Multi-tenant support
//  */

const SiteInfo = ({ customizer, metaData }: { customizer: any; metaData: any }) => {
  return (
    <Stack direction="column">
      <Typography className={`logo-brand-${customizer.activeMode}`}>
        {metaData?.logo.brand.text}
      </Typography>
      <Typography className={`logo-brand-desc-${customizer.activeMode}`}>
        {metaData?.logo.brandDesc.text}
      </Typography>
    </Stack>
  );
};

interface EnhancedLogoProps {
  size?: number;
  showText?: boolean;
  brandName?: string;
  brandDescription?: string;
  className?: string;
  onClick?: () => void;
  strategy?: AssetStrategy;
  src?: string;
}

/**
 * Enhanced Logo component with advanced features
 *
 * Features:
 * - Automatic CDN optimization
 * - Tenant-specific logo loading
 * - Fallback handling
 * - Loading states
 * - Click handling
 * - Optional text display
 */

// const getLogoUrl = (metaData: any, customizer: any) => {
//   const computedLogoUrl = metaData
//     ? metaData.logo?.image?.[customizer.activeMode as 'light' | 'dark']?.src
//     : ''
//   // Get the logo URL from constants
//   const logoUrl = computedLogoUrl ? DYNAMIC_LOGO_URL.logo.url(computedLogoUrl) : null
//   return logoUrl
// }

export const SmartLogo = ({
  size = 40,
  className,
  onClick,
  strategy = "cdn",
  src,
}: EnhancedLogoProps) => {
  // const { fetchAsset, ready } = useAssetWorker()

  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const customizer = useCustomizerStore();
  const [imageError, _setImageError] = useState(false);
  const [enhancedSrc, setEnhancedSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const LinkStyled = styled(Box)(() => ({
    height: "var(--topbar-height)",
    width: "var(--sidebar-width)",
    overflow: "hidden",
    display: "block",
    cursor: "pointer",
  }));

  const router = useRouter();

  // Handle click to navigate to home or custom action
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    if (!src || !strategy || enhancedSrc) {
      return;
    }

    if (strategy === "cdn") {
      setEnhancedSrc(withCdnUrl(src));
      setLoading(false);
    }
  }, [strategy, enhancedSrc, src]);

  if (!enhancedSrc || loading || imageError) {
    return (
      <Skeleton
        variant="rounded"
        width={size}
        height={size}
        animation="wave"
        sx={{ borderRadius: 1 }}
      />
    );
  }

  const logo = (
    <img
      src={enhancedSrc}
      alt={"Logo"} // Ensure alt text is always provided
      className={className}
      width={size}
      height={size}
    />
  );

  return (
    <Stack position={"relative"} top="5px">
      <LinkStyled onClick={handleClick}>
        <Stack direction="row-reverse" alignItems="center" spacing={2}>
          {logo}
          {!customizer.isCollapse || customizer.isSidebarHover || mdUp ? (
            <SiteInfo customizer={customizer} metaData={null} />
          ) : null}
        </Stack>
      </LinkStyled>
    </Stack>
  );
};

export default SmartLogo;
