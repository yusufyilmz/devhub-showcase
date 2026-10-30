"use client";
import { CollectionEditor } from "@shared/components/collection-editor";
import { Field, LinesField, SelectField } from "@shared/components/fields";
import {
  type AuthorableSectionType,
  authorableSections,
  type CustomSection,
  getSectionRenderers,
  type SectionOptions,
  type SectionSourceField,
} from "@shared/content";

import type { SectionEditorProps } from "../types";

function OptionsEditor({
  section,
  type,
  onChange,
}: SectionEditorProps & { type: AuthorableSectionType }) {
  const view = authorableSections[type].view;
  const options = section.options ?? {};
  const change = (patch: Partial<SectionOptions>) =>
    onChange({ ...section, options: { ...options, ...patch } });
  return (
    <div className="editor-fields">
      <Field
        label="Section description"
        multiline
        onChange={(description) => change({ description })}
        value={options.description ?? ""}
      />
      <SelectField
        label="Text alignment"
        onChange={(alignment) => change({ alignment: alignment as SectionOptions["alignment"] })}
        value={options.alignment ?? "left"}
      >
        {["left", "center", "right"].map((value) => (
          <option key={value}>{value}</option>
        ))}
      </SelectField>
      <SelectField
        label="Columns"
        onChange={(value) => change({ columns: Number(value) as 1 | 2 | 3 | 4 })}
        value={String(options.columns ?? 3)}
      >
        {[1, 2, 3, 4].map((value) => (
          <option key={value}>{value}</option>
        ))}
      </SelectField>
      {view === "hero" && (
        <Field
          label="Hero image URL"
          onChange={(mediaUrl) => change({ mediaUrl })}
          type="url"
          value={options.mediaUrl ?? ""}
        />
      )}
      {view === "contact" && (
        <Field
          hint="The contact form opens the visitor’s email app. No message is sent by this website."
          label="Recipient email"
          onChange={(email) => change({ email })}
          required
          type="email"
          value={options.email ?? ""}
        />
      )}
      {view === "newsletter" && (
        <Field
          hint="Your existing newsletter subscription page. No mailing list is created here."
          label="Subscription page URL"
          onChange={(actionUrl) => change({ actionUrl })}
          required
          type="url"
          value={options.actionUrl ?? ""}
        />
      )}
      {view === "map" && (
        <>
          <Field
            label="Latitude"
            onChange={(value) => change({ latitude: value === "" ? undefined : Number(value) })}
            type="number"
            value={options.latitude?.toString() ?? ""}
          />
          <Field
            label="Longitude"
            onChange={(value) => change({ longitude: value === "" ? undefined : Number(value) })}
            type="number"
            value={options.longitude?.toString() ?? ""}
          />
        </>
      )}
    </div>
  );
}
function SourceEditor({
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
function ItemFields({
  item,
  onChange,
  view,
}: {
  item: CustomSection["items"][number];
  onChange: (item: CustomSection["items"][number]) => void;
  view: string;
}) {
  return (
    <>
      <Field
        label="Item title"
        onChange={(title) => onChange({ ...item, title })}
        required
        value={item.title}
      />
      <Field
        hint="Plain text. Separate paragraphs with a blank line."
        label="Item details"
        multiline
        onChange={(body) => onChange({ ...item, body })}
        value={item.body}
      />
      <Field
        hint="Public HTTP or HTTPS URL. Shop and plan links open your external checkout or product page."
        label="Item link"
        onChange={(url) => onChange({ ...item, url })}
        type="url"
        value={item.url}
      />
      <Field
        label="Cover image URL"
        onChange={(imageUrl) => onChange({ ...item, imageUrl })}
        type="url"
        value={item.imageUrl ?? ""}
      />
      {["pricing", "shop", "menu", "property", "statistics"].includes(view) && (
        <Field
          label="Price or value"
          onChange={(value) => onChange({ ...item, value })}
          value={item.value ?? ""}
        />
      )}
      {["timeline", "posts", "awards", "careers"].includes(view) && (
        <Field
          label="Date or period"
          onChange={(period) => onChange({ ...item, period })}
          value={item.period ?? ""}
        />
      )}
      {view === "video" && (
        <Field
          hint="Optional WebVTT captions for direct MP4, WebM or Ogg video files."
          label="Video captions URL"
          onChange={(captionsUrl) => onChange({ ...item, captionsUrl })}
          type="url"
          value={item.captionsUrl ?? ""}
        />
      )}
      <LinesField
        label="Features or bullet points"
        onChange={(details) => onChange({ ...item, details: details.filter(Boolean) })}
        value={item.details ?? []}
      />
      {view === "steps" && (
        <Field
          label="Code example"
          multiline
          onChange={(code) => onChange({ ...item, code })}
          value={item.code ?? ""}
        />
      )}
    </>
  );
}
export function SectionContentEditor({
  section,
  type,
  onChange,
  sourceItems,
}: SectionEditorProps & { type: AuthorableSectionType }) {
  const definition = authorableSections[type];
  return (
    <div className="section-library-editor">
      <OptionsEditor onChange={onChange} section={section} type={type} />
      <SelectField
        label="Section display"
        onChange={(renderer) =>
          onChange({
            ...section,
            renderer: renderer as CustomSection["renderer"],
          })
        }
        value={section.renderer}
      >
        {getSectionRenderers(type).map((view) => (
          <option key={view} value={view}>
            {view}
          </option>
        ))}
      </SelectField>
      <SourceEditor onChange={onChange} section={section} sourceItems={sourceItems} type={type} />
      {!section.source &&
        !["heading", "contact", "map", "toc", "newsletter"].includes(definition.view) && (
          <CollectionEditor<CustomSection["items"][number]>
            create={() => ({
              body: "",
              id: crypto.randomUUID(),
              title: "New item",
              url: "",
            })}
            getTitle={(item) => item.title}
            items={section.items}
            maxItems={30}
            onChange={(items) => onChange({ ...section, items })}
            render={(item, change) => (
              <ItemFields item={item} onChange={change} view={definition.view} />
            )}
            title="Section items"
          />
        )}
      {["youtube", "instagram", "pinterest", "video"].includes(type) && (
        <p>
          Use public work URLs and optional cover images. YouTube players load on visitor request;
          Instagram and Pinterest remain curated visual links.
        </p>
      )}
    </div>
  );
}
