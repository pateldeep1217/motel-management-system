import { ColumnDef } from "@tanstack/react-table";
import { BookingStatusCell } from "@/lib/StatusCells";
import { Checkbox } from "@/components/ui/checkbox";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { Actions } from "../rooms/actions";
import { useState } from "react";

export type ResponseType = InferResponseType<
  typeof client.api.bookings.$get,
  200
>["data"][0];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const monthNumber = (date.getMonth() + 1).toString().padStart(2, "0");

  return {
    display: `${month} ${day}`,
    full: `${month} ${day}, ${year}`,
    tooltip: `${month} ${day}, ${year} (${monthNumber}/${day}/${year})`,
  };
};

const CustomTooltip = ({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-10 px-2 py-1 text-sm text-white bg-black rounded-md shadow-lg -top-8 left-1/2 transform -translate-x-1/2">
          {content}
        </div>
      )}
    </div>
  );
};

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
    accessorKey: "guestName",
    header: "Guest Name",
    cell: ({ row }) => <div>{row.getValue("guestName")}</div>,
  },
  {
    accessorKey: "roomNumber",
    header: "Room",
    cell: ({ row }) => <div>{row.getValue("roomNumber")}</div>,
  },
  {
    accessorKey: "checkInDate",
    header: "Check-in",
    cell: ({ row }) => {
      const date = formatDate(row.getValue("checkInDate"));
      return (
        <CustomTooltip content={date.tooltip}>
          <div className="cursor-help">{date.display}</div>
        </CustomTooltip>
      );
    },
    sortDescFirst: true,
  },
  {
    accessorKey: "checkOutDate",
    header: "Check-out",
    cell: ({ row }) => {
      const date = formatDate(row.getValue("checkOutDate"));
      return (
        <CustomTooltip content={date.tooltip}>
          <div className="cursor-help">{date.display}</div>
        </CustomTooltip>
      );
    },
    sortDescFirst: true,
  },
  {
    id: "nights",
    header: "Nights",
    cell: ({ row }) => {
      const checkInDate = new Date(row.getValue("checkInDate"));
      const checkOutDate = new Date(row.getValue("checkOutDate"));
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return <div>{nights}</div>;
    },
    sortDescFirst: true,
  },
  {
    accessorKey: "paymentMethod",
    header: " Payment",
    cell: ({ row }) => <div>{row.getValue("paymentMethod")}</div>,
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
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
