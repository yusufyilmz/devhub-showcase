"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "../../buttons/button";
import { Card } from "../../cards";
import type { SectionItemCardOptions } from "./types";

export function SectionItemCard({
  item,
  type,
  surface = "semantic",
  accordion = false,
}: SectionItemCardOptions) {
  const content = accordion ? (
    <details>
      <summary>
        {item.title}
        <ChevronDown aria-hidden="true" size={16} />
      </summary>
      <div>{item.content}</div>
    </details>
  ) : (
    <>
      <h3>{item.title}</h3>
      {item.content}
    </>
  );

  switch (type) {
    case "reveal":
      return (
        <Card heading={<h3>{item.title}</h3>} title={item.title} type="reveal">
          {item.content}
        </Card>
      );

    case "content":
      return (
        <Card title={item.title} type="content">
          {item.content}
        </Card>
      );

    case "variants":
      return <Card type="variants">{content}</Card>;

    case "appearance":
      return (
        <Card surface={surface} type="appearance">
          {content}
        </Card>
      );

    case "hover":
      return (
        <Card
          trigger={
            <Button type="button" variant="outline">
              {item.title}
            </Button>
          }
          type="hover"
        >
          {item.content}
        </Card>
      );

    default:
      return (
        <Card
          className={
            accordion
              ? "section-disclosure-card"
              : "section-item-card [&[data-slot='card']]:[gap:0.5rem]"
          }
          interaction={accordion ? "static" : "lift"}
          layout="plain"
          surface={surface}
          type={type}
        >
          {content}
        </Card>
      );
  }
}
