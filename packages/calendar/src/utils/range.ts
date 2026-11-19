import { monday, shiftDate } from "@shared/utils/date";

export function calendarRange(date: string) {
  const from = monday(`${date.slice(0, 7)}-01`);
  return { from, to: shiftDate(from, 42) };
}
