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
        The same information, presented your way. You can change this later without losing your
        content.
      </p>
      <div className="type-picker-grid">
        {portfolioTypes.map((type) => (
          <label className="type-choice" data-selected={value === type.id} key={type.id}>
            <input
              checked={value === type.id}
              name="portfolio-type"
              onChange={() => onChange(type.id)}
              type="radio"
              value={type.id}
            />
            <span aria-hidden="true" className="type-thumbnail" data-type={type.id}>
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
