import { ColumnDef } from "@tanstack/react-table";
import { BookingStatusCell } from "@/lib/StatusCells";
import { Checkbox } from "@/components/ui/checkbox";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { Actions } from "../rooms/actions";

export type ResponseType = InferResponseType<
  typeof client.api.bookings.$get,
  200
>["data"][0];

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => <div className="text-center">Booking ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "guestName",
    header: "Guest Name",
    cell: ({ row }) => <div>{row.getValue("guestName")}</div>,
  },
  {
    accessorKey: "checkInDate",
    header: "Check-in Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("checkInDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
    sortDescFirst: true,
  },
  {
    accessorKey: "checkOutDate",
    header: "Check-out Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("checkOutDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
    sortDescFirst: true,
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div>{formatted}</div>;
    },
    sortDescFirst: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: BookingStatusCell,
    sortDescFirst: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
