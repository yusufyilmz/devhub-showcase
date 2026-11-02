"use client";
import { Plus, X } from "lucide-react";

import type { MealIngredient } from "@shared/services/types";
import { Button as LibraryButton } from "@shared/ui/button";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";

interface Props {
  items: MealIngredient[];
  mealTaskId: string;
  onChange: (items: MealIngredient[]) => void;
}
export function IngredientEditor({ mealTaskId, items, onChange }: Props) {
  const patch = (id: string, changes: Partial<MealIngredient>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...changes } : i)));
  return (
    <section className="ingredient-editor">
      <h3>Shopping ingredients</h3>
      <p className="hint">
        Use the same group for alternatives and tick “Choice.” Unknown quantities stay blank.
        Optional items are excluded from shopping.
      </p>
      {items.map((item) => (
        <div className="ingredient-input" key={item.id}>
          <div className="row">
            <LibraryLabel unstyled>
              Name
              <LibraryInput
                onChange={(e) =>
                  patch(item.id, {
                    ingredientKey: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    name: e.target.value,
                  })
                }
                required
                unstyled
                value={item.name}
              />
            </LibraryLabel>
            <LibraryButton
              aria-label={`Remove ${item.name}`}
              className="icon-btn danger"
              onClick={() => onChange(items.filter((i) => i.id !== item.id))}
              type="button"
              variant="unstyled"
            >
              <X size={16} />
            </LibraryButton>
          </div>
          <div className="form-grid three">
            <LibraryLabel unstyled>
              Minimum
              <LibraryInput
                min="0"
                onChange={(e) => {
                  const v = e.target.value === "" ? null : Number(e.target.value);
                  patch(item.id, {
                    quantityMax: v === null ? null : Math.max(v, item.quantityMax ?? v),
                    quantityMin: v,
                  });
                }}
                step="any"
                type="number"
                unstyled
                value={item.quantityMin ?? ""}
              />
            </LibraryLabel>
            <LibraryLabel unstyled>
              Maximum
              <LibraryInput
                min="0"
                onChange={(e) => {
                  const v = e.target.value === "" ? null : Number(e.target.value);
                  patch(item.id, {
                    quantityMax: v,
                    quantityMin: v === null ? null : (item.quantityMin ?? v),
                  });
                }}
                step="any"
                type="number"
                unstyled
                value={item.quantityMax ?? ""}
              />
            </LibraryLabel>
            <LibraryLabel unstyled>
              Unit
              <LibraryInput
                onChange={(e) => patch(item.id, { unit: e.target.value })}
                required
                unstyled
                value={item.unit}
              />
            </LibraryLabel>
          </div>
          <LibraryLabel unstyled>
            Group
            <LibraryInput
              onChange={(e) => patch(item.id, { groupId: e.target.value })}
              required
              unstyled
              value={item.groupId}
            />
          </LibraryLabel>
          <div className="row checkbox-row">
            <LibraryLabel unstyled>
              <LibraryInput
                checked={item.isChoice}
                onChange={(e) => patch(item.id, { isChoice: e.target.checked })}
                type="checkbox"
                unstyled
              />
              Choice
            </LibraryLabel>
            <LibraryLabel unstyled>
              <LibraryInput
                checked={item.optional}
                onChange={(e) => patch(item.id, { optional: e.target.checked })}
                type="checkbox"
                unstyled
              />
              Optional
            </LibraryLabel>
          </div>
          <LibraryLabel unstyled>
            Note
            <LibraryInput
              onChange={(e) => patch(item.id, { note: e.target.value })}
              unstyled
              value={item.note}
            />
          </LibraryLabel>
        </div>
      ))}
      <LibraryButton
        className="outline"
        onClick={() =>
          onChange([
            ...items,
            {
              groupId: crypto.randomUUID(),
              id: crypto.randomUUID(),
              ingredientKey: "new-ingredient",
              isChoice: false,
              mealTaskId,
              name: "",
              note: "",
              optional: false,
              position: items.length,
              quantityMax: null,
              quantityMin: null,
              unit: "g",
            },
          ])
        }
        type="button"
        variant="unstyled"
      >
        <Plus size={16} />
        Add ingredient
      </LibraryButton>
    </section>
  );
}
