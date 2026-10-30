"use client";
import { type ReactNode, useState } from "react";
export function LibraryPicker({
  items,
}: {
  items: { id: string; title: string; content: ReactNode }[];
}) {
  const [selected, setSelected] = useState(items[0]?.id);
  return (
    <div className="home-library-demo">
      <fieldset className="home-library-buttons">
        <legend className="sr-only">Section examples</legend>
        {items.map((item) => (
          <button
            aria-controls={`home-section-${item.id}`}
            aria-pressed={selected === item.id}
            key={item.id}
            onClick={() => setSelected(item.id)}
            type="button"
          >
            {item.title}
          </button>
        ))}
      </fieldset>
      {items.map((item) => (
        <section
          aria-label={`${item.title} section example`}
          className="home-library-preview"
          hidden={selected !== item.id}
          id={`home-section-${item.id}`}
          key={item.id}
        >
          {item.content}
        </section>
      ))}
      <p className="home-sample-note">
        Fictional content. These are the same section renderers used in portfolios.
      </p>
    </div>
  );
}
