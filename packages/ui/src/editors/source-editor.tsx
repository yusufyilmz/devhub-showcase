"use client";

import {
  type AuthorableSectionType,
  authorableSections,
  type SectionSourceField,
} from "@shared/config";

import { SelectField } from "../forms";
import type { SectionEditorProps } from "../sections/types";

export function SourceEditor({
  section,
  type,
  onChange,
  sourceItems,
}: SectionEditorProps & { type: AuthorableSectionType }) {
  const fields: readonly string[] = authorableSections[type].sources;
  if (!fields.length) return null;
  const source = section.source;
  const choices = source ? (sourceItems?.[source.field] ?? []) : [];
  return (
    <fieldset>
      <legend>Content source</legend>
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
            {field}
          </option>
        ))}
      </SelectField>
      {source && (
        <>
          <label>
            <input
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
            />{" "}
            All current and future items
          </label>
          {choices.map((item) => (
            <label className="section-source-choice" key={item.id}>
              <input
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
              />{" "}
              {item.title}
            </label>
          ))}
          <p>Sources use this profile’s saved fields. Private projects stay excluded publicly.</p>
        </>
      )}
    </fieldset>
  );
}
