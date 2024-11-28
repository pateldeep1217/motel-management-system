import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export function ExtendStayModal({ isOpen, onClose, onSubmit, booking }) {
  const [newCheckOutDate, setNewCheckOutDate] = useState(booking?.checkOutDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    const additionalDays = differenceInDays(
      new Date(newCheckOutDate),
      new Date(booking.checkOutDate)
    );
    const additionalAmount = additionalDays * booking.dailyRate;
    onSubmit(booking.id, newCheckOutDate, additionalAmount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extend Stay</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentCheckOut">Current Check-out Date</Label>
            <Input
              id="currentCheckOut"
              value={
                booking?.checkOutDate
                  ? format(new Date(booking?.checkOutDate), "PPP")
                  : ""
              }
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newCheckOut">New Check-out Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {newCheckOutDate ? (
                    format(new Date(newCheckOutDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={new Date(newCheckOutDate)}
                  onSelect={(date) => setNewCheckOutDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Extend Stay</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
