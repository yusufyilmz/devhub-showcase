import { formatPortfolioPeriod, type Language } from "@shared/content";

export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string | null,
  language: Language = "en",
) {
  return formatPortfolioPeriod(startDate, endDate, language);
}
