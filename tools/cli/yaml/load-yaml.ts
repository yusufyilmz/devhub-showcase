import {
  binaryTag,
  CORE_SCHEMA,
  load,
  mergeTag,
  omapTag,
  pairsTag,
  setTag,
  timestampTag,
} from "js-yaml";

// Keep YAML 1.2 scalars and the non-executable tags used by v4 config/frontmatter.
const CONFIG_SCHEMA = CORE_SCHEMA.withTags(
  mergeTag,
  timestampTag,
  binaryTag,
  omapTag,
  pairsTag,
  setTag,
);
export function loadYaml(source: string, filename?: string): unknown {
  // v5 load() rejects empty streams; preserve the config loader's previous result.
  if (!source.trim()) return undefined;
  return load(source, {
    schema: CONFIG_SCHEMA,
    ...(filename ? { filename } : {}),
  });
}
