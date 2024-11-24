import { format } from "date-fns";
import { CalendarDays, User, DollarSign, CreditCard } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface BookingDetailsModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onCheckOut: (bookingId: string) => void;
  isCheckingOut: boolean;
}

export function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
  onCheckOut,
  isCheckingOut,
}: BookingDetailsModalProps) {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Guest Name</p>
                <p className="font-medium">{booking.guestName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Check-in Date</p>
                <p className="font-medium">
                  {format(new Date(booking.checkInDate), "PPP")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Check-out Date</p>
                <p className="font-medium">
                  {format(new Date(booking.checkOutDate), "PPP")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Daily Rate</p>
                <p className="font-medium">${booking.dailyRate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium">${booking.totalAmount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{booking.paymentMethod}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => onCheckOut(booking.id)}
            disabled={isCheckingOut}
          >
            Check Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
