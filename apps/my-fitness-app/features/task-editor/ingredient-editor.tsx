"use client";
import { Plus, X } from "lucide-react";

import type { MealIngredient } from "@/lib/domain/nutrition";

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
            <label>
              Name
              <input
                onChange={(e) =>
                  patch(item.id, {
                    ingredientKey: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    name: e.target.value,
                  })
                }
                required
                value={item.name}
              />
            </label>
            <button
              aria-label={`Remove ${item.name}`}
              className="icon-btn danger"
              onClick={() => onChange(items.filter((i) => i.id !== item.id))}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
          <div className="form-grid three">
            <label>
              Minimum
              <input
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
                value={item.quantityMin ?? ""}
              />
            </label>
            <label>
              Maximum
              <input
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
                value={item.quantityMax ?? ""}
              />
            </label>
            <label>
              Unit
              <input
                onChange={(e) => patch(item.id, { unit: e.target.value })}
                required
                value={item.unit}
              />
            </label>
          </div>
          <label>
            Group
            <input
              onChange={(e) => patch(item.id, { groupId: e.target.value })}
              required
              value={item.groupId}
            />
          </label>
          <div className="row checkbox-row">
            <label>
              <input
                checked={item.isChoice}
                onChange={(e) => patch(item.id, { isChoice: e.target.checked })}
                type="checkbox"
              />
              Choice
            </label>
            <label>
              <input
                checked={item.optional}
                onChange={(e) => patch(item.id, { optional: e.target.checked })}
                type="checkbox"
              />
              Optional
            </label>
          </div>
          <label>
            Note
            <input onChange={(e) => patch(item.id, { note: e.target.value })} value={item.note} />
          </label>
        </div>
      ))}
      <button
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
      >
        <Plus size={16} />
        Add ingredient
      </button>
    </section>
  );
}
