export const downloadCVButtonStyles = {
  element1:
    "w-full inline-block bg-button-primary text-white hover:bg-gray-800 px-6 py-3 rounded-lg shadow-sm transition",
} as const;

export const goBackButtonStyles = {
  element1: "rounded-lg",
} as const;

export const homeButtonStyles = {
  element1: "rounded-lg",
} as const;

export function projectButtonClassName(...values: unknown[]): string {
  return `inline-block px-6 py-3 rounded-lg shadow-sm transition ${values[0]}`;
}
