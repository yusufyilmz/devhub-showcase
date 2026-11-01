"use client";

import type { ReactNode } from "react";

import { Button } from "../buttons";
import { Card } from "../cards";
import { EmptyState } from "../forms";

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || from >= items.length || to < 0 || to >= items.length || from === to) return items;
  const result = [...items];
  const [item] = result.splice(from, 1);
  if (item === undefined) return items;
  result.splice(to, 0, item);
  return result;
}
export function CollectionEditor<T extends { id: string }>({
  title,
  items,
  onChange,
  create,
  render,
  getTitle,
  onRemove,
  maxItems,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  render: (item: T, change: (item: T) => void) => ReactNode;
  getTitle: (item: T) => string;
  onRemove?: (item: T) => void;
  maxItems?: number;
}) {
  return (
    <section className="editor-collection">
      <div className="editor-section-heading">
        <div>
          <p className="eyebrow">MAKE IT YOURS</p>
          <h2>{title}</h2>
        </div>
        <Button
          className="studio-secondary"
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
          <article className="editor-card">
            <Card asChild layout="plain" surface="portfolio">
              <div className="editor-card-heading">
                <h3>{getTitle(item) || "New item"}</h3>
                <div className="editor-actions">
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
                    className="danger-button"
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
            <div className="editor-fields">
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
