import "../editor-controls.css";

import { authorableSections, getSectionLayouts, type SectionOptions } from "@shared/config";

import { Field, SelectField } from "../../../forms";
import { editorPanelStyles, optionsEditorStyles } from "../styles";
import type { OptionsEditorOptions } from "../types";

export function OptionsEditor({ section, type, onChange }: OptionsEditorOptions) {
  const { name, view } = authorableSections[type];
  const options = section.options ?? {};
  const change = (patch: Partial<SectionOptions>) =>
    onChange({ ...section, options: { ...options, ...patch } });
  return (
    <fieldset className={editorPanelStyles.panel}>
      <legend className={editorPanelStyles.legend}>{name} settings</legend>
      <p className={editorPanelStyles.description}>
        Set the description and presentation for this section.
      </p>
      <div className={optionsEditorStyles.element1}>
        <Field
          label="Section description"
          multiline
          onChange={(description) => change({ description })}
          value={options.description ?? ""}
        />
        <SectionLayoutField onChange={change} section={section} type={type} />
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
        {["hero", "cta"].includes(type) && (
          <Field
            hint="A public URL for the optional call-to-action button."
            label="Action URL"
            onChange={(actionUrl) => change({ actionUrl })}
            type="url"
            value={options.actionUrl ?? ""}
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
    </fieldset>
  );
}

function SectionLayoutField({
  onChange,
  section,
  type,
}: Pick<OptionsEditorOptions, "section" | "type"> & {
  onChange: (patch: Partial<SectionOptions>) => void;
}) {
  if (
    (type === "faq" && section.renderer !== "accordion") ||
    (type === "features" && section.renderer !== "cards")
  )
    return null;
  const layouts = getSectionLayouts(type);
  if (!layouts.length) return null;
  return (
    <SelectField
      label="Block layout"
      onChange={(value) => onChange({ layout: layouts.find(({ id }) => id === value)?.id })}
      value={section.options?.layout ?? ""}
    >
      <option value="">Default layout</option>
      {layouts.map(({ id, label }) => (
        <option key={id} value={id}>
          {label}
        </option>
      ))}
    </SelectField>
  );
}
