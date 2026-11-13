import { useId, useState } from "react";

import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { NativeSelect } from "@shared/ui/native-select";

import type { RunJobAction, Search, SearchFilters } from "./types";

const textFields = {
  country: "Country code",
  currency: "Salary currency",
  excludedCompanies: "Excluded companies (comma separated)",
  excludedKeywords: "Excluded keywords (comma separated)",
  keywords: "Keywords",
  location: "City or region",
  preferredCompanies: "Preferred companies (comma separated)",
  title: "Job title",
} as const;

const basicFields = ["title", "country", "location", "keywords"] as const;
const advancedFields = [
  "preferredCompanies",
  "excludedCompanies",
  "excludedKeywords",
  "currency",
] as const;

const options = {
  employment: ["full-time", "contract", "freelance"],
  experience: ["mid", "senior", "staff", "lead", "principal"],
  workplace: ["remote", "hybrid", "onsite"],
} as const;

const salaryFields = { maximum: "Maximum salary", minimum: "Minimum salary" } as const;
type SearchFormProps = { search?: Search; run: RunJobAction; busy: boolean };

function readFilters(form: FormData): SearchFilters {
  const get = (field: string) => String(form.get(field) ?? "").trim();
  const salary = (field: string) => (get(field) ? Number(get(field)) : null);
  return {
    country: get("country").toLowerCase(),
    currency: get("currency").toUpperCase(),
    employment: get("employment"),
    excludedCompanies: get("excludedCompanies"),
    excludedKeywords: get("excludedKeywords"),
    experience: get("experience"),
    keywords: get("keywords"),
    location: get("location"),
    maximum: salary("maximum"),
    minimum: salary("minimum"),
    postedDays: Number(get("postedDays")),
    preferredCompanies: get("preferredCompanies"),
    sponsorship: form.has("sponsorship"),
    title: get("title"),
    workplace: get("workplace"),
  };
}

export function SearchForm({ search, run, busy }: SearchFormProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const filters = search?.filters;
  function textField(name: keyof typeof textFields) {
    return (
      <Label key={name}>
        {textFields[name]}
        <Input
          defaultValue={filters?.[name] ?? (name === "country" ? "gb" : "")}
          maxLength={name === "country" ? 2 : name === "currency" ? 3 : 120}
          name={name}
          required={name === "title" || name === "country"}
        />
      </Label>
    );
  }

  return (
    <details
      className="job-hunter-details"
      onToggle={(event) => setOpen(event.currentTarget.open)}
      open={open}
    >
      <summary>
        {search
          ? `${search.name} · ${search.enabled ? "Enabled" : "Paused"}`
          : "Create a saved search"}
      </summary>
      <form
        className="job-hunter-stack job-hunter-details-body"
        onSubmit={async (event) => {
          event.preventDefault();
          const formElement = event.currentTarget;
          const form = new FormData(formElement);
          const saved = await run({
            action: "search",
            id: search?.id,
            search: {
              enabled: form.has("enabled"),
              filters: readFilters(form),
              hours: Number(form.get("hours")),
              name: form.get("name"),
              threshold: Number(form.get("threshold")),
            },
          });
          if (saved) {
            if (!search) formElement.reset();
            setOpen(false);
          }
        }}
      >
        <div className="job-hunter-grid">
          <Label>
            Search name
            <Input defaultValue={search?.name} maxLength={100} name="name" required />
          </Label>
          {basicFields.map(textField)}
        </div>
        <details
          className="job-hunter-details"
          onInvalidCapture={(event) => {
            event.currentTarget.open = true;
          }}
        >
          <summary>Advanced filters</summary>
          <div className="job-hunter-grid job-hunter-details-body">
            {advancedFields.map(textField)}
            {Object.entries(options).map(([name, values]) => (
              <Label className="job-hunter-capitalize" key={name}>
                {name}
                <NativeSelect defaultValue={filters?.[name as keyof typeof options]} name={name}>
                  <option value="">Any</option>
                  {values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </NativeSelect>
              </Label>
            ))}
            {Object.entries(salaryFields).map(([name, label]) => (
              <Label key={name}>
                {label}
                <Input
                  defaultValue={filters?.[name as keyof typeof salaryFields] ?? ""}
                  max={100_000_000}
                  min={0}
                  name={name}
                  type="number"
                />
              </Label>
            ))}
            <Label>
              Posted within (days, 0 for any date)
              <Input
                defaultValue={filters?.postedDays ?? 0}
                max={30}
                min={0}
                name="postedDays"
                type="number"
              />
            </Label>
            <div className="job-hunter-actions">
              <Checkbox
                defaultChecked={filters?.sponsorship}
                id={`${id}-sponsorship`}
                name="sponsorship"
              />
              <Label htmlFor={`${id}-sponsorship`}>Require visa sponsorship</Label>
            </div>
          </div>
        </details>
        <fieldset className="job-hunter-schedule job-hunter-stack">
          <legend>Schedule and alerts</legend>
          <div className="job-hunter-grid">
            <Label>
              Scan schedule
              <NativeSelect defaultValue={search?.hours ?? 12} name="hours">
                {[3, 6, 12, 24].map((hours) => (
                  <option key={hours} value={hours}>
                    Every {hours} hours
                  </option>
                ))}
              </NativeSelect>
            </Label>
            <Label>
              Alert threshold (%)
              <Input
                defaultValue={search?.threshold ?? 85}
                max={100}
                min={0}
                name="threshold"
                required
                type="number"
              />
            </Label>
          </div>
          <div className="job-hunter-actions">
            <Checkbox defaultChecked={search?.enabled} id={`${id}-enabled`} name="enabled" />
            <Label htmlFor={`${id}-enabled`}>
              Enable scheduled discovery and AI matching against my CV
            </Label>
          </div>
        </fieldset>
        <div className="job-hunter-actions">
          <Button disabled={busy} type="submit">
            Save search
          </Button>
          {search && (
            <Button
              disabled={busy}
              onClick={() => run({ action: "delete", id: search.id })}
              variant="outline"
            >
              Delete search
            </Button>
          )}
        </div>
      </form>
    </details>
  );
}
