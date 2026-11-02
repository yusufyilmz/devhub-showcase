import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "../feedback/badge/Badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";
import { sectionCardsStyles } from "./styles";

export function SectionCards() {
  return (
    <div className={sectionCardsStyles.element1}>
      <Card className={sectionCardsStyles.element2}>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className={sectionCardsStyles.element3}>$1,250.00</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className={sectionCardsStyles.element4}>
          <div className={sectionCardsStyles.element5}>
            Trending up this month <IconTrendingUp className={sectionCardsStyles.element6} />
          </div>
          <div className={sectionCardsStyles.element7}>Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
      <Card className={sectionCardsStyles.element8}>
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className={sectionCardsStyles.element9}>1,234</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className={sectionCardsStyles.element10}>
          <div className={sectionCardsStyles.element11}>
            Down 20% this period <IconTrendingDown className={sectionCardsStyles.element12} />
          </div>
          <div className={sectionCardsStyles.element13}>Acquisition needs attention</div>
        </CardFooter>
      </Card>
      <Card className={sectionCardsStyles.element14}>
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className={sectionCardsStyles.element15}>45,678</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className={sectionCardsStyles.element16}>
          <div className={sectionCardsStyles.element17}>
            Strong user retention <IconTrendingUp className={sectionCardsStyles.element18} />
          </div>
          <div className={sectionCardsStyles.element19}>Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className={sectionCardsStyles.element20}>
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className={sectionCardsStyles.element21}>4.5%</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className={sectionCardsStyles.element22}>
          <div className={sectionCardsStyles.element23}>
            Steady performance increase <IconTrendingUp className={sectionCardsStyles.element24} />
          </div>
          <div className={sectionCardsStyles.element25}>Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
