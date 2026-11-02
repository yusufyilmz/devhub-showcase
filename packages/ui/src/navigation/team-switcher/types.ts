import type * as React from "react";

export type TeamSwitcherOptions = {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
};
