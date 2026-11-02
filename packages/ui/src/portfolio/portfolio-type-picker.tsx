"use client";

import { portfolioTypes } from "@shared/config";

import { portfolioTypePickerStyles } from "./styles";
import type { PortfolioTypePickerOptions } from "./types";

export function PortfolioTypePicker({ value, onChange }: PortfolioTypePickerOptions) {
  return (
    <fieldset className={portfolioTypePickerStyles.element1}>
      <legend>Choose your portfolio layout</legend>
      <p>
        The same information, presented your way. You can change this later without losing your
        content.
      </p>
      <div className={portfolioTypePickerStyles.element2}>
        {portfolioTypes.map((type) => (
          <label
            className={portfolioTypePickerStyles.element3}
            data-selected={value === type.id}
            key={type.id}
          >
            <input
              checked={value === type.id}
              name="portfolio-type"
              onChange={() => onChange(type.id)}
              type="radio"
              value={type.id}
            />
            <span
              aria-hidden="true"
              className={portfolioTypePickerStyles.element4}
              data-type={type.id}
            >
              <span className={portfolioTypePickerStyles.element5} />
              <span className={portfolioTypePickerStyles.element6} />
              <span className={portfolioTypePickerStyles.element7}>
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
