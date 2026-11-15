import { z } from "zod";

import { profileSchema } from "@shared/lib/profiles";

type Shape = {
  type?: string;
  properties?: Record<string, Shape>;
  required?: string[];
  items?: Shape;
  anyOf?: Shape[];
  enum?: unknown[];
  additionalProperties?: Shape | boolean;
};
const contract = z.toJSONSchema(profileSchema, { io: "input", unrepresentable: "any" }) as Shape;
function objectMatches(value: Record<string, unknown>, rule: Shape): boolean {
  if (rule.required?.some((key) => !(key in value))) return false;
  return Object.entries(value).every(([key, entry]) => {
    const child = Object.hasOwn(rule.properties ?? {}, key) ? rule.properties?.[key] : undefined;
    if (child) return matches(entry, child);
    if (rule.additionalProperties === false) return false;
    return typeof rule.additionalProperties === "object"
      ? matches(entry, rule.additionalProperties)
      : true;
  });
}
function matches(value: unknown, rule: Shape): boolean {
  if (rule.anyOf) return rule.anyOf.some((option) => matches(value, option));
  if (rule.enum && !rule.enum.includes(value)) return false;
  if (rule.type === "null") return value === null;
  if (rule.type === "array")
    return (
      Array.isArray(value) && value.every((entry) => !rule.items || matches(entry, rule.items))
    );
  if (rule.type === "object")
    return Boolean(
      value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        objectMatches(value as Record<string, unknown>, rule),
    );
  if (rule.type === "integer") return Number.isInteger(value);
  return !rule.type || typeof value === rule.type;
}
// Recovery permits incomplete text, dates and URLs while preserving structural
// types and enum values. The server still runs full validation on explicit save.
export function isDraftStructure(value: unknown) {
  return matches(value, contract);
}
