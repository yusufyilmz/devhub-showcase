# Shared calendar

MyDevStudio and Fitness share the month and week calendar, daily agenda, and scheduled task fields. The apps own authentication, persistence, and domain-specific behavior.

- Import `CalendarGrid` from `@shared/calendar/calendar-grid`. Pass normalized items by date and a selected date. Use the optional render and move callbacks for app-specific actions.
- Import `DayAgenda` and `AgendaItem` from `@shared/calendar/day-agenda` to group items by hour. Supply a different row renderer when the app has its own task controls.
- Import `TaskForm` from `@shared/calendar/task-form` for a title, description, date, optional time, and completion state. The caller saves the submitted draft and presents success or failure. Use `ScheduleFields` for date and time within a larger form.
- Import `CalendarItem`, `calendarRange`, and task validation from `@shared/calendar`. Dates use `YYYY-MM-DD`, and times use local `HH:mm`. An omitted time represents an all-day or untimed item.
- Import the OAuth and provider functions from `@shared/calendar/google` in server code. The host app supplies its Google configuration and stores refresh credentials privately. The provider returns normalized events, dated tasks, and any partial-load warnings.

See [My Calendar setup and verification](../../docs/testing/manual/my-calendar.md).
