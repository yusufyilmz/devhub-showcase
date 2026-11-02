/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */

import { feedbackClassName, feedbackStyles, variants } from "./styles";
import type { FeedbackOptions } from "./types";

export function Feedback({
  variant = "info",
  title,
  description,
  children,
  onClose,
}: FeedbackOptions) {
  return (
    <div className={feedbackClassName(variants[variant])} role="alert">
      <div className={feedbackStyles.element1}>
        {title ? <p className={feedbackStyles.element2}>{title}</p> : null}
        {description ? <p className={feedbackStyles.element3}>{description}</p> : null}
        {children}
      </div>
      {onClose ? (
        <button
          aria-label="Dismiss"
          className={feedbackStyles.element4}
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
