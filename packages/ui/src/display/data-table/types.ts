import type { CSSProperties } from "react";

import type { Row } from "@tanstack/react-table";
import type { z } from "zod";

import type { schema } from "./schema";

export type DragHandleOptions = { id: number };

export type DataTableItem = z.infer<typeof schema>;
export interface DataTableProps {
  data: DataTableItem[];
}
export interface DraggableRowProps {
  row: Row<DataTableItem>;
}
export interface TableCellViewerProps {
  item: DataTableItem;
}

export type DataTableInlineStyle1Values = [CSSProperties["transform"], CSSProperties["transition"]];
