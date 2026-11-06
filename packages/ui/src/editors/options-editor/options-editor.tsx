import "../../styles/components/editors/editor-controls.css";

import { authorableSections, type SectionOptions } from "@shared/config";

import { Field, SelectField } from "../../forms";
import { optionsEditorStyles } from "../styles";
import type { OptionsEditorOptions } from "../types";

export function OptionsEditor({ section, type, onChange }: OptionsEditorOptions) {
  const { name, view } = authorableSections[type];
  const options = section.options ?? {};
  const change = (patch: Partial<SectionOptions>) =>
    onChange({ ...section, options: { ...options, ...patch } });
  return (
    <fieldset className="ui-editor-panel">
      <legend>{name} settings</legend>
      <p>Set the description and presentation for this section.</p>
      <div className={optionsEditorStyles.element1}>
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
    </fieldset>
  );
}
