"use client";

import "../editor-controls.css";

import { authorableSections, type SectionSourceField } from "@shared/config";
import { SelectField } from "@shared/ui/forms";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";

import { editorPanelStyles } from "../styles";
import type { SourceEditorOptions } from "../types";

export function SourceEditor({ section, type, onChange, sourceItems }: SourceEditorOptions) {
  const fields: readonly string[] = authorableSections[type].sources;
  if (!fields.length) return null;
  const source = section.source;
  const choices = source ? (sourceItems?.[source.field] ?? []) : [];
  return (
    <fieldset className={editorPanelStyles.panel}>
      <legend className={editorPanelStyles.legend}>Content source</legend>
      <p className={editorPanelStyles.description}>
        Write content for this section or reuse a saved profile field.
      </p>
      <SelectField
        label="Use content from"
        onChange={(field) =>
          onChange({
            ...section,
            source: field ? { field: field as SectionSourceField, type: "profile" } : undefined,
          })
        }
        value={source?.field ?? ""}
      >
        <option value="">Own content</option>
        {fields.map((field) => (
          <option key={field} value={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </option>
        ))}
      </SelectField>
      {source && (
        <>
          <LibraryLabel className={editorPanelStyles.choice} unstyled>
            <LibraryInput
              checked={!source.itemIds}
              className={editorPanelStyles.checkbox}
              onChange={(event) =>
                onChange({
                  ...section,
                  source: {
                    ...source,
                    itemIds: event.target.checked ? undefined : [],
                  },
                })
              }
              type="checkbox"
              unstyled
            />
            <span className="min-w-0">All current and future items</span>
          </LibraryLabel>
          {choices.map((item) => (
            <LibraryLabel className={editorPanelStyles.choice} key={item.id} unstyled>
              <LibraryInput
                checked={source.itemIds?.includes(item.id) ?? true}
                className={editorPanelStyles.checkbox}
                onChange={(event) => {
                  const selected = source.itemIds ?? choices.map(({ id }) => id);
                  onChange({
                    ...section,
                    source: {
                      ...source,
                      itemIds: event.target.checked
                        ? [...selected, item.id]
                        : selected.filter((id) => id !== item.id),
                    },
                  });
                }}
                type="checkbox"
                unstyled
              />
              <span className="min-w-0">{item.title}</span>
            </LibraryLabel>
          ))}
          <p className={editorPanelStyles.description}>
            Sources use this profile’s saved fields. Private projects stay excluded publicly.
          </p>
        </>
      )}
    </fieldset>
  );
}
