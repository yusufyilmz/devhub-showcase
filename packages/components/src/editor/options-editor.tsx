import {
  type AuthorableSectionType,
  authorableSections,
  type SectionOptions,
} from "@shared/config";

import { Field, SelectField } from "../forms";
import type { SectionEditorProps } from "../sections/variants";

export function OptionsEditor({
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
