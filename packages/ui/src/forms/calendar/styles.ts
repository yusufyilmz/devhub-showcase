export const calendarStyles = {
  calendar:
    "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
  calendar2: "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
  calendar3: "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
  calendar4: "select-none font-medium",
  calendar5: "text-sm",
  calendar6:
    "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
  calendar7:
    "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
  calendar8: "text-muted-foreground opacity-50",
  calendar9: "absolute bg-popover inset-0 opacity-0",
  calendar10:
    "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
  calendar11: "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
  calendar12: "invisible",
  calendar13: "flex flex-col w-full gap-4",
  calendar14: "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
  calendar15: "flex gap-4 flex-col md:flex-row relative",
  calendar16: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
  calendar17: "text-muted-foreground aria-selected:text-muted-foreground",
  calendar18: "rounded-r-md bg-accent",
  calendar19: "rounded-none",
  calendar20: "rounded-l-md bg-accent",
  calendar21: "w-fit",
  calendar22: "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
  calendar23: "flex w-full mt-2",
  calendar24: "text-[0.8rem] select-none text-muted-foreground",
  calendar25: "select-none w-(--cell-size)",
  calendar26: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
  calendar27: "flex",
  calendarChevron: "size-4",
  calendarChevron2: "size-4",
  calendarChevron3: "size-4",
  calendarDayButton:
    "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
  element1: "flex size-(--cell-size) items-center justify-center text-center",
} as const;
