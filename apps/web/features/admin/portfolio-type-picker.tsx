"use client";
import { type PortfolioType, portfolioTypes } from "@shared/content";

export function PortfolioTypePicker({
  value,
  onChange,
}: {
  value: PortfolioType;
  onChange: (type: PortfolioType) => void;
}) {
  return (
    <fieldset className="type-picker">
      <legend>Choose your portfolio layout</legend>
      <p>
        The same information, presented your way. You can change this later
        without losing your content.
      </p>
      <div className="type-picker-grid">
        {portfolioTypes.map((type) => (
          <label
            className="type-choice"
            key={type.id}
            data-selected={value === type.id}
          >
            <input
              type="radio"
              name="portfolio-type"
              value={type.id}
              checked={value === type.id}
              onChange={() => onChange(type.id)}
            />
            <span
              className="type-thumbnail"
              data-type={type.id}
              aria-hidden="true"
            >
              <span className="type-thumb-title" />
              <span className="type-thumb-subtitle" />
              <span className="type-thumb-blocks">
                <i />
                <i />
                <i />
              </span>
            </span>
            <strong>{type.name}</strong>
            <span>{type.description}</span>
            <small>{type.audience}</small>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
