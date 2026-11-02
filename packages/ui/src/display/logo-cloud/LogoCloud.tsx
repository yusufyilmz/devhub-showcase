/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
import { logoCloudStyles } from "./styles";
import type { LogoCloudOptions } from "./types";
export function LogoCloud({ logos }: LogoCloudOptions) {
  return (
    <ul className={logoCloudStyles.element1}>
      {logos.map((logo) => (
        <li className={logoCloudStyles.element2} key={logo.src}>
          {logo.href ? (
            <a href={logo.href}>
              <img alt={logo.alt} className={logoCloudStyles.element3} src={logo.src} />
            </a>
          ) : (
            <img alt={logo.alt} className={logoCloudStyles.element4} src={logo.src} />
          )}
        </li>
      ))}
    </ul>
  );
}
