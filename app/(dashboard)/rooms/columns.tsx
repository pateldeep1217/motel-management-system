"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";

export type ResponseType = InferResponseType<
  typeof client.api.rooms.$get,
  200
>["data"][0];

export const columns: ColumnDef<ResponseType>[] = [
  {
    accessorKey: "number",
    header: "Room Number",
    cell: ({ row }) => <div>{row.getValue("number")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // Since the API is already joining with roomStatuses table and returning the status field
      // We can directly use the status value from the row
      const status = row.getValue("status") as string;

      return (
        <Badge
          variant={
            status as "available" | "occupied" | "maintenance" | "cleaning"
          }
        >
          {status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Unknown"}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
