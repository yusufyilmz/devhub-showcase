import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "../../feedback/badge/Badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../card/Card";

const metrics = [
  {
    change: "+12.5%",
    detail: "Visitors for the last 6 months",
    icon: IconTrendingUp,
    label: "Total Revenue",
    trend: "Trending up this month",
    value: "$1,250.00",
  },
  {
    change: "-20%",
    detail: "Acquisition needs attention",
    icon: IconTrendingDown,
    label: "New Customers",
    trend: "Down 20% this period",
    value: "1,234",
  },
  {
    change: "+12.5%",
    detail: "Engagement exceeds targets",
    icon: IconTrendingUp,
    label: "Active Accounts",
    trend: "Strong user retention",
    value: "45,678",
  },
  {
    change: "+4.5%",
    detail: "Meets growth projections",
    icon: IconTrendingUp,
    label: "Growth Rate",
    trend: "Steady performance increase",
    value: "4.5%",
  },
];

export function SectionCards() {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-3 @lg:grid-cols-2 @4xl:grid-cols-4">
        {metrics.map(({ change, detail, icon: Icon, label, trend, value }) => (
          <Card className="gap-3" interaction="static" key={label}>
            <CardHeader>
              <CardDescription className="min-w-0 wrap-anywhere">{label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tracking-tight tabular-nums">
                {value}
              </CardTitle>
              <CardAction>
                <Badge>
                  <Icon aria-hidden="true" />
                  {change}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="font-medium">{trend}</div>
              <div className="text-muted-foreground">{detail}</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
