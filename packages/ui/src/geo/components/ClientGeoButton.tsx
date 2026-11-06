"use client";

import React from "react";

import { Button } from "@once-ui/buttons";

import { Column } from "@shared/ui/layout";

import { useClientGeo } from "../hooks/useClientGeo";

interface ClientGeoButtonProps {
  onLocationReceived?: (location: any) => void;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "s" | "m" | "l";
}

export function ClientGeoButton({
  onLocationReceived,
  variant = "secondary",
  size = "m",
}: ClientGeoButtonProps) {
  const { location, loading, error, requestLocation } = useClientGeo();

  React.useEffect(() => {
    if (location && onLocationReceived) {
      onLocationReceived(location);
    }
  }, [location, onLocationReceived]);

  const handleClick = () => {
    requestLocation();
  };

  return (
    <Column gap="s" fillWidth>
      {/** biome-ignore assist/source/useSortedAttributes: <explanation> */}
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        loading={loading}
        prefixIcon="location"
      >
        {loading ? "Getting Location..." : "Get My Location"}
      </Button>

      {error && (
        <Badge background="danger-weak" onBackground="danger-strong">
          {error}
        </Badge>
      )}

      {location && (
        <Column gap="xs" padding="s" background="neutral-weak" radius="m">
          <Row gap="s" align="center">
            <Typography variant="label-strong-s">📍 Your Location:</Typography>
          </Row>

          {location.formatted_address && (
            <Typography variant="body-default-s" onBackground="neutral-medium">
              📍 {location.formatted_address}
            </Typography>
          )}

          <Row gap="l">
            <Typography variant="body-default-xs" onBackground="neutral-medium">
              Lat: {location.latitude.toFixed(4)}
            </Typography>
            <Typography variant="body-default-xs" onBackground="neutral-medium">
              Lng: {location.longitude.toFixed(4)}
            </Typography>
            <Typography variant="body-default-xs" onBackground="neutral-medium">
              Accuracy: ±{Math.round(location.accuracy)}m
            </Typography>
          </Row>
        </Column>
      )}
    </Column>
  );
}
