export const googleProfileCategories = ["basic", "location", "phone", "birthday", "work"] as const;
export type GoogleProfileCategory = (typeof googleProfileCategories)[number];
export const googleProfilePermissions: Record<
  GoogleProfileCategory,
  { label: string; scopes: string[]; fields: string[] }
> = {
  basic: {
    fields: ["names", "emailAddresses"],
    label: "Name and email",
    scopes: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  },
  birthday: {
    fields: ["birthdays"],
    label: "Birthdate (optional)",
    scopes: ["https://www.googleapis.com/auth/user.birthday.read"],
  },
  location: {
    fields: ["addresses"],
    label: "City, region and country",
    scopes: ["https://www.googleapis.com/auth/user.addresses.read"],
  },
  phone: {
    fields: ["phoneNumbers"],
    label: "Phone number",
    scopes: ["https://www.googleapis.com/auth/user.phonenumbers.read"],
  },
  work: {
    fields: ["organizations"],
    label: "Current job title and organization",
    scopes: ["https://www.googleapis.com/auth/user.organization.read"],
  },
};
