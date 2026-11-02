import { brandStyles } from "./styles";
export function Brand() {
  return (
    <a aria-label="MyDevStudio home" className={brandStyles.element1} href="/">
      <svg aria-hidden="true" height="32" viewBox="0 0 32 32" width="32">
        <rect fill="currentColor" height="30" opacity=".12" rx="9" width="30" x="1" y="1" />
        <path
          d="M9 23V10l7 8 7-8v13"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
      </svg>
      <span>
        mydev<span className={brandStyles.element2}>studio</span>
        <b>.</b>
      </span>
    </a>
  );
}
