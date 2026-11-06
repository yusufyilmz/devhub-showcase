"use client";

import "../editor-controls.css";

import { authorableSections, type SectionSourceField } from "@shared/config";

import { SelectField } from "../../forms";
import { Input as LibraryInput } from "../../forms/input/Input";
import { Label as LibraryLabel } from "../../forms/label/Label";
import { sourceEditorStyles } from "../styles";
import type { SourceEditorOptions } from "../types";

export function SourceEditor({ section, type, onChange, sourceItems }: SourceEditorOptions) {
  const fields: readonly string[] = authorableSections[type].sources;
  if (!fields.length) return null;
  const source = section.source;
  const choices = source ? (sourceItems?.[source.field] ?? []) : [];
  return (
    <fieldset className="ui-editor-panel">
      <legend>Content source</legend>
      <p>Write content for this section or reuse a saved profile field.</p>
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
          <LibraryLabel className={sourceEditorStyles.element1} unstyled>
            <LibraryInput
              checked={!source.itemIds}
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
            />{" "}
            All current and future items
          </LibraryLabel>
          {choices.map((item) => (
            <LibraryLabel className={sourceEditorStyles.element1} key={item.id} unstyled>
              <LibraryInput
                checked={source.itemIds?.includes(item.id) ?? true}
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
              />{" "}
              {item.title}
            </LibraryLabel>
          ))}
          <p>Sources use this profile’s saved fields. Private projects stay excluded publicly.</p>
        </>
      )}
    </fieldset>
  );
}
