import type React from "react";

import { Card, CardBody } from "../../cards";
import { referralItemStyles } from "./styles";
import type { ReferralItemOptions, ReferralItemProps } from "./types";

const Comment = ({ comment }: ReferralItemOptions) => (
  <div className={referralItemStyles.element1}>
    <span className={referralItemStyles.element2}>“</span>
    {comment}
  </div>
);

export const ReferralItem: React.FC<ReferralItemProps> = ({ referral, children }) => {
  return (
    <Card className={referralItemStyles.element3} surface="portfolio">
      <CardBody>
        {referral.feedback && <Comment comment={referral.feedback} />}
        {referral.recommendation && <Comment comment={referral.recommendation} />}
        <div className={referralItemStyles.element4}>
          <h3 className={referralItemStyles.element5}>{referral.name || "Anonymous"}</h3>
          <p className={referralItemStyles.element6}>
            {referral.relationship || "No relationship provided"}
          </p>
        </div>
      </CardBody>
      {children}
    </Card>
  );
};
