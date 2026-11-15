import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function ShopItemsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="shop-items" />;
}
