import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PaymentModal({ isOpen, onClose, onSubmit, booking }) {
  const [amount, setAmount] = useState(booking?.pendingAmount || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(booking.id, parseFloat(amount));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pendingAmount">Pending Amount</Label>
            <Input
              id="pendingAmount"
              value={booking?.pendingAmount.toFixed(2)}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentAmount">Payment Amount</Label>
            <Input
              id="paymentAmount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={booking?.pendingAmount}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Process Payment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
