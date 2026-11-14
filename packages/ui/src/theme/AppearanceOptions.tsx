"use client";

import { getPortfolioThemeAppearance, type PortfolioTheme } from "@shared/config";
import { themeOptions } from "@shared/config/theme";
import { useThemeStore } from "@shared/runtime/user";

import { Button } from "../buttons/button/Button";
import {
  appearanceLabel,
  appearancePreviewStyle,
  appearanceSample,
  appearanceSections,
  preferenceGroups,
} from "./styles";

function applyPortfolioThemeChoice(value: string) {
  useThemeStore.getState().setThemePreferences({
    ...getPortfolioThemeAppearance(value as PortfolioTheme),
    "portfolio-theme": value,
  });
}

function clearPreference(key: string) {
  useThemeStore.setState((state) => ({
    themePreferences: Object.fromEntries(
      Object.entries(state.themePreferences).filter(([name]) => name !== key),
    ),
  }));
}

function chooseAppearance(preference: string, value: string) {
  if (preference === "portfolio-theme" && value) {
    applyPortfolioThemeChoice(value);
    return;
  }
  if (value) useThemeStore.getState().setThemePreferences({ [preference]: value });
  else clearPreference(preference);
}

function PreferenceField({ preference }: { preference: (typeof preferenceGroups)[number] }) {
  const preferences = useThemeStore((state) => state.themePreferences);
  return (
    <fieldset className="appearance-group [min-width:0] [padding:0] [margin:0] [border:0] [&_legend]:[margin-bottom:10px] [font-size:13px] [font-weight:600] [&_legend]:[text-transform:capitalize]">
      <legend>{appearanceLabel(preference)}</legend>
      <div
        className="appearance-options [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:10px] [grid-template-columns:repeat(auto-fill,_minmax(76px,_1fr))] [gap:8px]"
        data-options={preference}
      >
        {["", ...(themeOptions[preference] ?? [])].map((value, index) => (
          <Button
            aria-label={`${appearanceLabel(preference)}: ${value || "Page default"}`}
            aria-pressed={(preferences[preference] ?? "") === value}
            className="appearance-choice [display:grid] [gap:8px] [padding:10px] [font-size:12px] [color:var(--muted-foreground)] [text-transform:capitalize] [background:transparent] [border:1px_solid_var(--border)] [border-radius:12px] hover:[background:var(--secondary)] [&[aria-pressed='true']]:[color:var(--foreground)] motion-safe:hover:[&_.appearance-sample[data-kind='animation']:not([data-value='none']):not([data-value=''])]:[animation:appearance-preview_700ms_ease-in-out_alternate_2] motion-safe:hover:[&_.appearance-sample[data-kind='transition']:not([data-value='none']):not([data-value=''])]:[transform:translateY(-4px)]"
            key={value}
            onClick={() => chooseAppearance(preference, value)}
            type="button"
            variant="unstyled"
          >
            <span
              aria-hidden="true"
              className="appearance-sample [&[data-value='cyan']]:[background:#67d8e7] [&[data-value='violet']]:[background:#b8a5ff] [&[data-value='emerald']]:[background:#67d6a0] [&[data-value='serif']]:[font-family:Georgia,_serif] [&[data-value='mono']]:[font-family:ui-monospace,_monospace] [&[data-value='compact']]:[letter-spacing:-8px] [&[data-value='spacious']]:[letter-spacing:6px] [&[data-value='square']]:[border-radius:0] [&[data-value='pill']]:[border-radius:40px] [&[data-value='sans']]:[font-family:var(--font-geist-sans,_system-ui),_sans-serif] [&[data-value='']]:[color:var(--muted-foreground)] [&[data-kind='border']]:[border:calc(var(--preview-rank)_*_1px)_solid_var(--primary)] [&[data-kind='border'][data-value='none']]:[border:0] [&[data-kind='blur']]:[filter:blur(calc((var(--preview-rank)_-_1)_*_0.4px))] [&[data-kind='shadow']]:[place-self:center] [&[data-kind='shadow'][data-value='none']]:[box-shadow:none] [&[data-kind='opacity']]:[opacity:calc(1_-_var(--preview-rank)_*_0.12)] [&[data-kind='tracking'][data-value='wide']]:[letter-spacing:5px] [&[data-kind='container']]:[justify-self:center] [&[data-kind='gradient'][data-value='subtle']]:[background:linear-gradient(_135deg,_color-mix(in_srgb,_var(--primary)_10%,_transparent),_color-mix(in_srgb,_var(--primary)_35%,_transparent)_)] [&[data-kind='gradient'][data-value='vivid']]:[background:linear-gradient(135deg,_var(--clr-violet-600),_var(--clr-cyan-600))] [&[data-kind='perspective'][data-value='normal']]:[transform:perspective(80px)_rotateY(20deg)] [&[data-kind='perspective'][data-value='dramatic']]:[transform:perspective(80px)_rotateY(40deg)] [&[data-kind='radius']]:[border-radius:min(40px,_calc(var(--preview-rank)_*_4px))] [&[data-kind='radius'][data-value='none']]:[border-radius:0] [&[data-kind='radius'][data-value='square']]:[border-radius:0] [&[data-kind='scale']]:[font-size:calc(14px_+_var(--preview-rank)_*_2px)] [&[data-kind='spacing']]:[letter-spacing:calc(var(--preview-rank)_*_1px)] [&[data-kind='line-height']]:[line-height:calc(0.8_+_var(--preview-rank)_*_0.2)] [&[data-kind='mode']]:[position:relative] [&[data-kind='mode']_i]:[width:75%] [&[data-kind='mode'][data-value='dark']]:[background:#101929] [&[data-kind='mode'][data-value='dark']_i]:[background:#a0b1c6] [&[data-kind='mode'][data-value='system']]:[background:linear-gradient(90deg,_#f6f8fb_50%,_#101929_50%)] motion-safe:[&[data-kind='transition']]:[transition:transform_calc(100ms_+_var(--preview-rank)_*_100ms)_ease]"
              data-kind={preference}
              data-value={value}
              style={appearancePreviewStyle(preference, value, index)}
            >
              {appearanceSample(preference, value)}
            </span>
            <span>{appearanceLabel(value || "Page default")}</span>
          </Button>
        ))}
      </div>
    </fieldset>
  );
}

export function AppearanceOptions() {
  const mode = useThemeStore((state) => state.activeMode);
  const grouped = new Set<string>(appearanceSections.flatMap((section) => section.keys));
  const remaining = preferenceGroups.filter((key) => !grouped.has(key));
  return (
    <div className="appearance-visual-options [display:grid] [gap:28px] [align-content:start] [min-height:0] [padding:3px_8px_8px_3px] [overflow-y:auto]">
      {appearanceSections.map((section) => (
        <section
          className="appearance-section [display:grid] [gap:16px] [min-width:0] [&_h3]:[margin:0] [font-size:16px] [font-weight:650] [&_+_.appearance-section]:[padding-top:8px] [border-top:1px_solid_var(--border)]"
          key={section.label}
        >
          <h3>{section.label}</h3>
          {section.label === "Color" ? (
            <fieldset className="appearance-group [min-width:0] [padding:0] [margin:0] [border:0] [&_legend]:[margin-bottom:10px] [font-size:13px] [font-weight:600] [&_legend]:[text-transform:capitalize]">
              <legend>Color mode</legend>
              <div className="appearance-options [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:10px] [grid-template-columns:repeat(auto-fill,_minmax(76px,_1fr))] [gap:8px]">
                {(["light", "dark", "system"] as const).map((value) => (
                  <Button
                    aria-label={`Mode: ${value}`}
                    aria-pressed={(mode ?? "system") === value}
                    className="appearance-choice [display:grid] [gap:8px] [padding:10px] [font-size:12px] [color:var(--muted-foreground)] [text-transform:capitalize] [background:transparent] [border:1px_solid_var(--border)] [border-radius:12px] hover:[background:var(--secondary)] [&[aria-pressed='true']]:[color:var(--foreground)] motion-safe:hover:[&_.appearance-sample[data-kind='animation']:not([data-value='none']):not([data-value=''])]:[animation:appearance-preview_700ms_ease-in-out_alternate_2] motion-safe:hover:[&_.appearance-sample[data-kind='transition']:not([data-value='none']):not([data-value=''])]:[transform:translateY(-4px)]"
                    key={value}
                    onClick={() => useThemeStore.getState().setActiveMode(value)}
                    type="button"
                    variant="unstyled"
                  >
                    <span
                      aria-hidden="true"
                      className="appearance-sample [&[data-value='cyan']]:[background:#67d8e7] [&[data-value='violet']]:[background:#b8a5ff] [&[data-value='emerald']]:[background:#67d6a0] [&[data-value='serif']]:[font-family:Georgia,_serif] [&[data-value='mono']]:[font-family:ui-monospace,_monospace] [&[data-value='compact']]:[letter-spacing:-8px] [&[data-value='spacious']]:[letter-spacing:6px] [&[data-value='square']]:[border-radius:0] [&[data-value='pill']]:[border-radius:40px] [&[data-value='sans']]:[font-family:var(--font-geist-sans,_system-ui),_sans-serif] [&[data-value='']]:[color:var(--muted-foreground)] [&[data-kind='border']]:[border:calc(var(--preview-rank)_*_1px)_solid_var(--primary)] [&[data-kind='border'][data-value='none']]:[border:0] [&[data-kind='blur']]:[filter:blur(calc((var(--preview-rank)_-_1)_*_0.4px))] [&[data-kind='shadow']]:[place-self:center] [&[data-kind='shadow'][data-value='none']]:[box-shadow:none] [&[data-kind='opacity']]:[opacity:calc(1_-_var(--preview-rank)_*_0.12)] [&[data-kind='tracking'][data-value='wide']]:[letter-spacing:5px] [&[data-kind='container']]:[justify-self:center] [&[data-kind='gradient'][data-value='subtle']]:[background:linear-gradient(_135deg,_color-mix(in_srgb,_var(--primary)_10%,_transparent),_color-mix(in_srgb,_var(--primary)_35%,_transparent)_)] [&[data-kind='gradient'][data-value='vivid']]:[background:linear-gradient(135deg,_var(--clr-violet-600),_var(--clr-cyan-600))] [&[data-kind='perspective'][data-value='normal']]:[transform:perspective(80px)_rotateY(20deg)] [&[data-kind='perspective'][data-value='dramatic']]:[transform:perspective(80px)_rotateY(40deg)] [&[data-kind='radius']]:[border-radius:min(40px,_calc(var(--preview-rank)_*_4px))] [&[data-kind='radius'][data-value='none']]:[border-radius:0] [&[data-kind='radius'][data-value='square']]:[border-radius:0] [&[data-kind='scale']]:[font-size:calc(14px_+_var(--preview-rank)_*_2px)] [&[data-kind='spacing']]:[letter-spacing:calc(var(--preview-rank)_*_1px)] [&[data-kind='line-height']]:[line-height:calc(0.8_+_var(--preview-rank)_*_0.2)] [&[data-kind='mode']]:[position:relative] [&[data-kind='mode']_i]:[width:75%] [&[data-kind='mode'][data-value='dark']]:[background:#101929] [&[data-kind='mode'][data-value='dark']_i]:[background:#a0b1c6] [&[data-kind='mode'][data-value='system']]:[background:linear-gradient(90deg,_#f6f8fb_50%,_#101929_50%)] motion-safe:[&[data-kind='transition']]:[transition:transform_calc(100ms_+_var(--preview-rank)_*_100ms)_ease]"
                      data-kind="mode"
                      data-value={value}
                    >
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>{value}</span>
                  </Button>
                ))}
              </div>
            </fieldset>
          ) : null}
          {section.keys.map((key) => (
            <PreferenceField key={key} preference={key} />
          ))}
        </section>
      ))}
      {remaining.map((key) => (
        <PreferenceField key={key} preference={key} />
      ))}
    </div>
  );
}
