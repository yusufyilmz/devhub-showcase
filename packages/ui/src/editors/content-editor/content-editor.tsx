"use client";

import "../../styles/components/editors/editor-controls.css";

import { authorableSections, type CustomSection, getSectionRenderers } from "@shared/config";

import { Field, LinesField, SelectField } from "../../forms";
import { CollectionEditor } from "../collection-editor";
import { OptionsEditor } from "../options-editor";
import { SourceEditor } from "../source-editor";
import { contentEditorStyles } from "../styles";
import type { ItemFieldsOptions, SectionContentEditorOptions } from "../types";

function ItemFields({ item, onChange, view }: ItemFieldsOptions) {
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
}: SectionContentEditorOptions) {
  const definition = authorableSections[type];
  return (
    <div className={contentEditorStyles.element1}>
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
