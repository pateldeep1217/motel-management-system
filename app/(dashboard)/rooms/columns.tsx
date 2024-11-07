"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

import { InferResponseType } from "hono";
import { client } from "@/lib/hono";

import { Actions } from "./actions";

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
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
