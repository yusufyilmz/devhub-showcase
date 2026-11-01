/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
export function LogoCloud({ logos }: { logos: { src: string; alt: string; href?: string }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
      {logos.map((logo) => (
        <li
          className="grid place-items-center rounded-xl bg-backgroundColor-card px-6 py-5"
          key={logo.src}
        >
          {logo.href ? (
            <a href={logo.href}>
              <img alt={logo.alt} className="max-h-8 w-auto object-contain" src={logo.src} />
            </a>
          ) : (
            <img alt={logo.alt} className="max-h-8 w-auto object-contain" src={logo.src} />
          )}
        </li>
      ))}
    </ul>
  );
}
