"use client";
import { type ReactNode, useState } from "react";

import type { AssetStrategy } from "@shared/assets/types";
import { Box, CircularProgress, Tooltip, Typography } from "@shared/ui/feedback";

interface SmartJsonProps<T = any> {
  /**
   * URL of the JSON resource to load
   */
  src: string;

  /**
   * Default data to use while loading or if fetch fails
   */
  defaultData?: T;

  /**
   * Function to render the JSON data
   */
  children: (data: T) => ReactNode;

  /**
   * Custom loading component
   */
  loadingComponent?: ReactNode;

  /**
   * Custom error component
   */
  errorComponent?: (error: Error) => ReactNode;

  /**
   * Whether to refresh the data periodically
   */
  refreshInterval?: number;

  /**
   * Whether to use offline cache first
   */
  offlineFirst?: boolean;

  /**
   * Whether to automatically parse the JSON
   */
  autoParse?: boolean;

  /**
   * Transform function to apply to the data after parsing
   */
  transform?: (data: any) => T;

  /**
   * Data validation function
   */
  validate?: (data: any) => boolean;

  /**
   * Whether to show debug information
   */
  debug?: boolean;

  /**
   * Loading strategy for the JSON
   */
  strategy?: AssetStrategy;
}

/**
 * SmartJson component for optimized JSON loading with caching and offline support
 *
 * Features:
 * - Automatic caching with IndexedDB
 * - Offline-first capability
 * - Automatic parsing and transformation
 * - Error handling and fallbacks
 * - Periodic refresh
 * - Data validation
 *
 * @example
 * ```tsx
 * <SmartJson
 *   src="https://rustykey.io:8080/config.json"
 *   defaultData={{ version: "1.0.0" }}
 *   offlineFirst
 * >
 *   {(data) => (
 *     <div>
 *       <h1>Config Version: {data.version}</h1>
 *       <pre>{JSON.stringify(data, null, 2)}</pre>
 *     </div>
 *   )}
 * </SmartJson>
 * ```
 */
export function SmartJson<T = any>({
  src,
  defaultData,
  children,
  loadingComponent,
  errorComponent,
  refreshInterval,
  offlineFirst = false,
  autoParse = true,
  transform,
  validate,
  debug = false,
  strategy = "proxy",
}: SmartJsonProps<T>) {
  // const { fetchAsset, ready } = useAssetWorker()
  const [data, _setData] = useState<T | undefined>(defaultData);
  const [loading, _setLoading] = useState(true);
  const [error, _setError] = useState<Error | null>(null);
  const [lastUpdated, _setLastUpdated] = useState<Date | null>(null);

  // const fetchData = useCallback(async () => {
  //   if (!ready) return

  //   try {
  //     setLoading(true)
  //     setError(null)

  //     // Get optimized URL (uses enhanced caching for JSON)
  //     const optimizedUrl = withProxyUrl(src)

  //     // Fetch the JSON with caching
  //     const response = await fetchAsset(optimizedUrl, 'json', {
  //       priority: 'high',
  //       // fallback: offlineFirst ? 'cache-only' : undefined,
  //     })

  //     // Parse the JSON if needed
  //     let parsedData: any

  //     if (autoParse && typeof response === 'string') {
  //       try {
  //         parsedData = JSON.parse(response)
  //       } catch (parseError) {
  //         throw new Error(`Failed to parse JSON: ${(parseError as Error).message}`)
  //       }
  //     } else {
  //       parsedData = response
  //     }

  //     // Validate the data if needed
  //     if (validate && !validate(parsedData)) {
  //       throw new Error('Data validation failed')
  //     }

  //     // Transform the data if needed
  //     const finalData = transform ? transform(parsedData) : parsedData

  //     setData(finalData as T)
  //     setLastUpdated(new Date())

  //     // Debug information is logged only in development and when debug flag is true
  //     if (debug && process.env.NODE_ENV === 'development') {
  //       // eslint-disable-next-line no-console
  //       logger.info('SmartJson loaded:', {
  //         src,
  //         data: finalData,
  //         timestamp: new Date().toISOString(),
  //       })
  //     }
  //   } catch (err) {
  //     setError(err as Error)
  //     if (debug && process.env.NODE_ENV === 'development') {
  //       // eslint-disable-next-line no-console
  //       logger.error('SmartJson error:', { error: err })
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [src, ready, fetchAsset, offlineFirst, autoParse, transform, validate, debug, strategy])

  // // Initial fetch
  // useEffect(() => {
  //   fetchData()
  // }, [fetchData])

  // // Set up refresh interval if needed
  // useEffect(() => {
  //   if (!refreshInterval) return

  //   const intervalId = setInterval(fetchData, refreshInterval)
  //   return () => clearInterval(intervalId)
  // }, [fetchData, refreshInterval])

  // Show loading state
  if (loading) {
    return (
      loadingComponent || (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Loading JSON...
          </Typography>
        </Box>
      )
    );
  }

  // Show error state
  if (error && !data) {
    return errorComponent ? (
      errorComponent(error)
    ) : (
      <Box sx={{ p: 2, color: "error.main", bgcolor: "error.light", borderRadius: 1 }}>
        <Typography variant="body2" fontWeight="medium">
          Error loading JSON: {error.message}
        </Typography>
      </Box>
    );
  }

  // Show data or fallback
  const content = (
    <>
      {children(data as T)}
      {debug && lastUpdated && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Typography>
      )}
    </>
  );

  // Add tooltip in development environment
  if (process.env.NODE_ENV === "development") {
    const sourceType = offlineFirst ? "Cache First" : "Network First";
    const refreshInfo = refreshInterval
      ? `Auto-refresh: ${refreshInterval / 1000}s`
      : "No auto-refresh";
    const transformInfo = transform ? "With transformation" : "No transformation";
    const validateInfo = validate ? "With validation" : "No validation";

    return (
      <Box position="relative">
        <Tooltip
          title={`Source: ${sourceType} | URL: ${src} | ${refreshInfo} | ${transformInfo} | ${validateInfo}`}
          arrow
          placement="top"
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 10,
              height: 10,
              bgcolor: offlineFirst ? "success.main" : "info.main",
              borderRadius: "50%",
              zIndex: 1,
              cursor: "help",
            }}
          />
        </Tooltip>
        {content}
      </Box>
    );
  }

  return content;
}

/**
 * SmartConfig component for loading configuration files
 * Specialized version of SmartJson with defaults for config files
 */
export function SmartConfig<T = any>({
  src,
  defaultData,
  children,
  ...props
}: Omit<SmartJsonProps<T>, "offlineFirst" | "autoParse">) {
  return (
    <SmartJson src={src} defaultData={defaultData} offlineFirst={true} autoParse={true} {...props}>
      {children}
    </SmartJson>
  );
}

/**
 * SmartData component for loading data files that need transformation
 * Specialized version of SmartJson with defaults for data files
 */
export function SmartData<T = any, R = any>({
  src,
  transform,
  children,
  ...props
}: Omit<SmartJsonProps<R>, "transform"> & { transform: (data: T) => R }) {
  return (
    <SmartJson src={src} transform={transform} autoParse={true} {...props}>
      {children}
    </SmartJson>
  );
}

export default SmartJson;
