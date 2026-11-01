import { myDevStudioLogin } from "./my-dev-studio";
import { myFitnessAppLogin } from "./my-fitness-app";

export const loginSites = {
  "my-dev-studio": myDevStudioLogin,
  "my-fitness-app": myFitnessAppLogin,
} as const;

export type LoginSiteId = keyof typeof loginSites;

export { myDevStudioLogin, myFitnessAppLogin };
