import { z } from "zod";
export const reservedUsernames = [
  "admin",
  "api",
  "auth",
  "p",
  "reviews",
  "login",
  "logout",
  "edit",
  "settings",
  "new",
  "account",
  "cv",
  "www",
] as const;
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(50)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens")
  .refine(
    (value) => !reservedUsernames.includes(value as (typeof reservedUsernames)[number]),
    "This username is reserved",
  );
export const cvPath = (username: string) => `/${encodeURIComponent(username)}`;
export const editCvPath = (username: string) => `${cvPath(username)}/edit`;
