import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoomResponseType } from "@/features/rooms/api/use-get-rooms";

interface RoomDetailsModalProps {
  room: RoomResponseType;
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (roomId: string) => void;
}

export function RoomDetailsModal({
  room,
  isOpen,
  onClose,
  onCheckIn,
}: RoomDetailsModalProps) {
  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Room {room.number} Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{room.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Type</h3>
              <p>{room.type}</p>
            </div>
            <div>
              <h3 className="font-semibold">Capacity</h3>
              <p>{room.capacity} persons</p>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {room.status === "Available" && (
            <Button onClick={() => onCheckIn(room.id)}>Check In</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
