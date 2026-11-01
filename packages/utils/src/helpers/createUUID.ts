import type { UUID } from "node:crypto";

import short from "short-uuid";

export const createUUID = (): UUID => {
  return short.generate() as `${string}-${string}-${string}-${string}-${string}`;
};
