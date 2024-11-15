import Badge from "@/components/ui/badge";

// Define all possible status types
type BookingStatus =
  | "confirmed"
  | "checked-in"
  | "checked-out"
  | "cancelled"
  | "no-show"
  | "reserved";
type RoomStatus = "available" | "occupied" | "maintenance" | "cleaning";
type StatusVariant = BookingStatus | RoomStatus;

// Generic status cell factory
const createStatusCell = <T extends StatusVariant>() => {
  return ({ row }: { row: any }) => {
    const rawStatus: string = row.getValue("status");
    const normalizedStatus: StatusVariant = rawStatus
      .toLowerCase()
      .replace(/ /g, "-") as StatusVariant;
    return (
      <Badge variant={normalizedStatus}>
        {rawStatus
          ? rawStatus
              .split(/[ -]/)
              .map(
                (word: string) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ")
          : "Unknown"}
      </Badge>
    );
  };
};

const BookingStatusCell = createStatusCell<BookingStatus>();
const RoomStatusCell = createStatusCell<RoomStatus>();

export { BookingStatusCell, RoomStatusCell, createStatusCell };
export type { BookingStatus, RoomStatus, StatusVariant };
