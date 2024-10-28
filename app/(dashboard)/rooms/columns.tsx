"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

// Define the Room type
export type Room = {
  id: string;
  number: string;
  type: string;
  capacity: number;
  price: number;
  status: "available" | "occupied" | "maintenance" | "cleaning";
  isOccupied: boolean;
  motelId: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Room>[] = [
  {
    accessorKey: "number",
    header: "Room Number",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("number")}</div>
    ),
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
      return <div className=" font-medium">{formatted}</div>;
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
            status.toLowerCase() === "available" ? "default" : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
  },
];
