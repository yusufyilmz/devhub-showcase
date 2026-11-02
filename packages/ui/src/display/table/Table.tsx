"use client";

import type * as React from "react";

import { cn } from "cn";

import { tableStyles } from "./styles";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className={tableStyles.element1} data-slot="table-container">
      <table className={cn(tableStyles.table, className)} data-slot="table" {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead className={cn(tableStyles.tableHeader, className)} data-slot="table-header" {...props} />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody className={cn(tableStyles.tableBody, className)} data-slot="table-body" {...props} />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot className={cn(tableStyles.tableFooter, className)} data-slot="table-footer" {...props} />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={cn(tableStyles.tableRow, className)} data-slot="table-row" {...props} />;
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return <th className={cn(tableStyles.tableHead, className)} data-slot="table-head" {...props} />;
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn(tableStyles.tableCell, className)} data-slot="table-cell" {...props} />;
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      className={cn(tableStyles.tableCaption, className)}
      data-slot="table-caption"
      {...props}
    />
  );
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
