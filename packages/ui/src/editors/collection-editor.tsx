"use client";

import { Button } from "../buttons";
import { Card } from "../cards";
import { EmptyState } from "../forms";
import { collectionEditorStyles } from "./styles";
import type { CollectionEditorItem, CollectionEditorProps } from "./types";

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || from >= items.length || to < 0 || to >= items.length || from === to) return items;
  const result = [...items];
  const [item] = result.splice(from, 1);
  if (item === undefined) return items;
  result.splice(to, 0, item);
  return result;
}
export function CollectionEditor<T extends CollectionEditorItem>({
  title,
  items,
  onChange,
  create,
  render,
  getTitle,
  onRemove,
  maxItems,
}: CollectionEditorProps<T>) {
  return (
    <section className={collectionEditorStyles.element1}>
      <div className={collectionEditorStyles.element2}>
        <div>
          <p className={collectionEditorStyles.element3}>MAKE IT YOURS</p>
          <h2>{title}</h2>
        </div>
        <Button
          className={collectionEditorStyles.element4}
          disabled={maxItems !== undefined && items.length >= maxItems}
          onClick={() => onChange([...items, create()])}
          type="button"
          variant="outline"
        >
          + Add {title.toLowerCase()}
        </Button>
      </div>
      {items.length === 0 && <EmptyState>Nothing here yet. Add your first item above.</EmptyState>}
      {items.map((item, index) => (
        <Card asChild key={item.id} layout="plain" surface="portfolio">
          <article className={collectionEditorStyles.element5}>
            <Card asChild layout="plain" surface="portfolio">
              <div className={collectionEditorStyles.element6}>
                <h3>{getTitle(item) || "New item"}</h3>
                <div className={collectionEditorStyles.element7}>
                  <Button
                    aria-label={`Move ${getTitle(item)} up`}
                    disabled={index === 0}
                    onClick={() => onChange(moveItem(items, index, index - 1))}
                    type="button"
                  >
                    ↑
                  </Button>
                  <Button
                    aria-label={`Move ${getTitle(item)} down`}
                    disabled={index === items.length - 1}
                    onClick={() => onChange(moveItem(items, index, index + 1))}
                    type="button"
                  >
                    ↓
                  </Button>
                  <Button
                    className={collectionEditorStyles.element8}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Remove ${getTitle(item) || "this item"}? Changes take effect when you save.`,
                        )
                      ) {
                        if (onRemove) onRemove(item);
                        else onChange(items.filter((row) => row.id !== item.id));
                      }
                    }}
                    type="button"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
            <div className={collectionEditorStyles.element9}>
              {render(item, (changed) =>
                onChange(items.map((row) => (row.id === item.id ? changed : row))),
              )}
            </div>
          </article>
        </Card>
      ))}
    </section>
  );
}
