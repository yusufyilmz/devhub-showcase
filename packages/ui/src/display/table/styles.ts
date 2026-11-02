export const tableStyles = {
  element1: "relative w-full overflow-x-auto",
  table: "w-full caption-bottom text-sm",
  tableBody: "[&_tr:last-child]:border-0",
  tableCaption: "text-muted-foreground mt-4 text-sm",
  tableCell:
    "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  tableFooter: "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
  tableHead:
    "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  tableHeader: "[&_tr]:border-b",
  tableRow: "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
} as const;
