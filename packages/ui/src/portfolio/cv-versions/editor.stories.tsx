import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { CvVersionsEditor } from "./editor";

const meta = { component: CvVersionsEditor, title: "Studio/Private CV versions" } satisfies Meta<
  typeof CvVersionsEditor
>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  args: {
    downloadHref: (id) => `/api/cv-variants/${id}/pdf`,
    load: async () => ({ revision: 0, variants: [] }),
    profile,
    save: async (library) => ({ ...library, revision: library.revision + 1 }),
    sourceRevision: 1,
  },
};
