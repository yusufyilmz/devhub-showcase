"use client";

import "../editor-controls.css";

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
        <h2>{title}</h2>
        <Button
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
        <Card asChild interaction="static" key={item.id} layout="plain">
          <article
            className={
              collapsible ? "editor-collection-item min-w-0" : collectionEditorStyles.element5
            }
          >
            {collapsible && (
              <Button
                aria-controls={`collection-${item.id}`}
                aria-expanded={expanded === item.id}
                aria-label={`${expanded === item.id ? "Close" : "Edit"} ${getTitle(item) || "new item"}`}
                className="editor-collection-toggle h-auto min-h-12 w-full justify-between gap-sm rounded-[inherit] px-md py-s text-left whitespace-normal wrap-anywhere text-card-foreground focus-visible:-outline-offset-2 aria-expanded:bg-foreground/5"
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                type="button"
                variant="ghost"
              >
                <span className="min-w-0 flex-1">
                  <strong className="font-medium">{getTitle(item) || "New item"}</strong>
                  {getSummary && (
                    <small className="block text-xs font-normal text-muted-foreground">
                      {getSummary(item)}
                    </small>
                  )}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {expanded === item.id ? "Close" : "Edit"}
                </span>
              </Button>
            )}
            <div
              className={collapsible ? "px-md pt-s pb-md" : undefined}
              hidden={collapsible && expanded !== item.id}
              id={`collection-${item.id}`}
            >
              <div className={collectionEditorStyles.element6}>
                <h3>{getTitle(item) || "New item"}</h3>
                <div className={collectionEditorStyles.element7}>
                  <Button
                    aria-label={`Move ${getTitle(item)} up`}
                    disabled={index === 0}
                    onClick={() => onChange(moveItem(items, index, index - 1))}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    ↑
                  </Button>
                  <Button
                    aria-label={`Move ${getTitle(item)} down`}
                    disabled={index === items.length - 1}
                    onClick={() => onChange(moveItem(items, index, index + 1))}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    ↓
                  </Button>
                  <Button
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
                    size="sm"
                    type="button"
                    variant="destructive"
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
