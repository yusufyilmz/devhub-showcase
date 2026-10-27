export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string | null
) {
  const start = new Date(startDate)

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC'
  })

  const formattedStartDate = formatter.format(start)

  const formattedEndDate = endDate
    ? formatter.format(new Date(endDate))
    : 'Present'

  return `${formattedStartDate} - ${formattedEndDate}`
}
