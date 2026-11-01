export const NullsToUndefined = (obj: any) => {
  if (obj === null) {
    return undefined;
  }
  if (typeof obj === "object") {
    for (const key in obj) {
      obj[key] = NullsToUndefined(obj[key]);
    }
  }
  return obj;
};
