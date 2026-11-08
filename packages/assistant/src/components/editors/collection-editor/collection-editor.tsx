"use client";

import { useState } from "react";

import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { EmptyState } from "@shared/ui/forms";

import { collectionEditorStyles } from "../styles";
import type { CollectionEditorItem, CollectionEditorProps } from "../types";

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
  getSummary,
  collapsible = false,
  onRemove,
  maxItems,
}: CollectionEditorProps<T>) {
  const [expanded, setExpanded] = useState<string | null>(null);
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
          onClick={() => {
            const item = create();
            onChange([...items, item]);
            setExpanded(item.id);
          }}
          type="button"
          variant="outline"
        >
          + Add {title.toLowerCase()}
        </Button>
      </div>
      {items.length === 0 && <EmptyState>Nothing here yet. Add your first item above.</EmptyState>}
      {items.map((item, index) => (
        <Card asChild key={item.id} layout="plain" surface="portfolio">
          <article
            className={collapsible ? "editor-collection-item" : collectionEditorStyles.element5}
          >
            {collapsible && (
              <Button
                aria-controls={`collection-${item.id}`}
                aria-expanded={expanded === item.id}
                aria-label={`${expanded === item.id ? "Close" : "Edit"} ${getTitle(item) || "new item"}`}
                className="editor-collection-toggle"
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                type="button"
                variant="ghost"
              >
                <span>
                  <strong>{getTitle(item) || "New item"}</strong>
                  {getSummary && <small>{getSummary(item)}</small>}
                </span>
                <span>{expanded === item.id ? "Close" : "Edit"}</span>
              </Button>
            )}
            <div hidden={collapsible && expanded !== item.id} id={`collection-${item.id}`}>
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
              <div className={collectionEditorStyles.element9}>
                {render(item, (changed) =>
                  onChange(items.map((row) => (row.id === item.id ? changed : row))),
                )}
              </div>
            </div>
          </article>
        </Card>
      ))}
    </section>
  );
}
