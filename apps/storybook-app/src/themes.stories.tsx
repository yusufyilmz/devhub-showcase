import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@shared/ui/button";

function ThemeGallery() {
  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-semibold">Your semantic themes</h1>
      <p className="text-muted-foreground">
        Choose White, Sand or Aqua and light or dark in the toolbar. Portals inherit the same
        document theme.
      </p>
      <section className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Controls</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Delete</Button>
          <Button disabled>Disabled</Button>
        </div>
        <label className="mt-6 block text-sm">
          Portfolio name
          <input
            className="mt-2 block rounded-md border border-input bg-background px-3 py-2 text-foreground outline-ring"
            placeholder="My studio"
          />
        </label>
      </section>
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          "background",
          "card",
          "primary",
          "secondary",
          "muted",
          "accent",
          "destructive",
          "border",
        ].map((token) => (
          <div className="rounded-lg border p-3" key={token}>
            <div className="mb-2 h-16 rounded-md" style={{ background: `var(--${token})` }} />
            <code>{token}</code>
          </div>
        ))}
      </section>
    </main>
  );
}

export default { component: ThemeGallery, title: "Design system/Themes" } satisfies Meta<
  typeof ThemeGallery
>;
export const Playground: StoryObj<typeof ThemeGallery> = {};
