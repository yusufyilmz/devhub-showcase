"use client";
import { Plus, X } from "lucide-react";

import type { MealIngredient } from "@shared/lib/types";
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
    <section className="ingredient-editor [padding-top:20px] [margin:20px_0] [border-top:1px_solid_var(--line)] [&_h3]:[margin-bottom:12px]">
      <h3>Shopping ingredients</h3>
      <p className="hint [font-size:11px] [line-height:1.7] [color:var(--muted)]">
        Use the same group for alternatives and tick “Choice.” Unknown quantities stay blank.
        Optional items are excluded from shopping.
      </p>
      {items.map((item) => (
        <div
          className="ingredient-input [padding:16px] [margin:14px_0] [background:var(--surface-soft)] [border:1px_solid_var(--line)] [border-radius:8px] [&_.row_>_label]:[flex:1] max-[700px]:[padding:12px]"
          key={item.id}
        >
          <div className="row [display:flex] [gap:10px] [align-items:center]">
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
              className="icon-btn [display:inline-flex] [align-items:center] [justify-content:center] [min-width:34px] [min-height:34px] [padding:8px] [color:var(--muted)] [background:transparent] [border:0] [border-radius:6px] hover:[background:var(--surface-soft)] hover:[color:var(--accent)] [background:var(--surface-soft)] danger [color:var(--danger)]"
              onClick={() => onChange(items.filter((i) => i.id !== item.id))}
              type="button"
              variant="unstyled"
            >
              <X size={16} />
            </LibraryButton>
          </div>
          <div className="form-grid [display:grid] [grid-template-columns:1fr_1fr] [gap:15px] three [grid-template-columns:repeat(3,_1fr)] max-[700px]:[gap:8px]">
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
          <div className="row [display:flex] [gap:10px] [align-items:center] checkbox-row [&_label]:[display:flex] [gap:8px] [&_input]:[width:auto] [margin:0]">
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
        className="outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]"
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
