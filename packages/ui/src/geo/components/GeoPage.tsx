"use client";

import { Button } from "@base-ui/react/button";

import { Card } from "../../cards";
import { Typography } from "../../display";
import { Flex } from "../../layout";
import { Heading } from "../../layout/header/HeadingLink";
import { ClientGeoButton } from "../components/ClientGeoButton";
import { useIPGeo } from "../hooks/useIPGeo";

export default function GeoDemo() {
  const { location: ipLocation, loading: ipLoading, error: ipError, refetch } = useIPGeo(false);

  return (
    <Column fillWidth paddingX="xl" paddingY="l" gap="xl">
      <Column gap="l" align="center" paddingY="xl">
        <Heading className="display-strong-xl" align="center">
          🌍 Client Geo Location Demo
        </Heading>
        <Typography className="body-default-l" align="center" onBackground="neutral-medium">
          Two ways to get the client's location
        </Typography>
      </Column>

      <Row gap="xl" fillWidth>
        {/* GPS-based location */}
        <Card padding="xl" fillWidth>
          <Column gap="l">
            <Heading className="heading-strong-l">📍 GPS Location (Precise)</Heading>
            <Typography variant="body-default-m" onBackground="neutral-medium">
              Uses the browser's geolocation API. Requires user permission but provides exact
              coordinates.
            </Typography>

            <ClientGeoButton onLocationReceived={(_loc) => {}} variant="primary" />
          </Column>
        </Card>

        {/* IP-based location */}
        <Card padding="xl" fillWidth>
          <Column gap="l">
            <Heading className="heading-strong-l">🌐 IP Location (No Permission)</Heading>
            <Typography className="body-default-m" onBackground="neutral-medium">
              Uses IP address lookup. Works automatically but less precise (city-level).
            </Typography>

            <Button onClick={refetch} variant="secondary" loading={ipLoading} prefixIcon="globe">
              {ipLoading ? "Getting IP Location..." : "Get IP Location"}
            </Button>

            {ipError && (
              <Typography className="body-default-s" onBackground="danger-strong">
                Error: {ipError}
              </Typography>
            )}

            {ipLocation && (
              <Flex gap="xs" padding="s" background="neutral-weak" radius="m">
                <Typography className="label-strong-s">🌐 IP-Based Location:</Typography>
                <Typography className="body-default-s">
                  📍 {ipLocation.formatted_address}
                </Typography>
                <Typography variant="body-default-xs" onBackground="neutral-medium">
                  IP: {ipLocation.ip} | ISP: {ipLocation.isp}
                </Typography>
                <Row gap="l">
                  <Typography variant="body-default-xs" onBackground="neutral-medium">
                    Lat: {ipLocation.latitude.toFixed(4)}
                  </Typography>
                  <Typography variant="body-default-xs" onBackground="neutral-medium">
                    Lng: {ipLocation.longitude.toFixed(4)}
                  </Typography>
                  <Typography variant="body-default-xs" onBackground="neutral-medium">
                    Timezone: {ipLocation.timezone}
                  </Typography>
                </Row>
              </Flex>
            )}
          </Column>
        </Card>
      </Row>

      <Card padding="xl" background="brand-weak">
        <Column gap="m">
          <Heading variant="heading-strong-m">💡 When to Use Each Method</Heading>
          <Column gap="s">
            <Typography variant="body-default-m">
              <strong>GPS Location:</strong> Use for location-based services, maps, delivery
              addresses
            </Typography>
            <Typography variant="body-default-m">
              <strong>IP Location:</strong> Use for analytics, content localization, fraud detection
            </Typography>
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
