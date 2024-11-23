"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBooking } from "@/features/bookings/api/use-create-booking";
import { useUpdateRoomStatus } from "@/features/rooms/api/use-update-room-status";

import { useGetRooms } from "@/features/rooms/api/use-get-rooms";
export default function CheckIn() {
  const [guestName, setGuestName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [idProof, setIdProof] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idProofImageUrl, setIdProofImageUrl] = useState("");
  const { mutate: createBooking } = useCreateBooking();
  const { mutate: updateRoomStatus } = useUpdateRoomStatus();
  const { data: rooms } = useGetRooms();

  const handleCheckIn = async () => {
    if (!guestName || !selectedRoom) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await createBooking({
        guestName,
        roomId: selectedRoom,
        checkInDate: new Date(),
        checkOutDate: new Date(), // You'll need to replace this with the actual check-out date
        bookingStatusId: "some-booking-status-id", // You'll need to replace this with the actual booking status ID
        totalAmount: "some-total-amount", // You'll need to replace this with the actual total amount
        dailyRate: "some-daily-rate", // You'll need to replace this with the actual daily rate
        paymentMethod: "Card",
      });

      await updateRoomStatus({
        id: selectedRoom,
        status: "occupied",
      });

      alert("Check-in successful!");
    } catch (error) {
      console.error("Check-in failed:", error);
      alert("Check-in failed. Please try again.");
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Room</Label>
        <Select onValueChange={setSelectedRoom}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a room" />
          </SelectTrigger>
          <SelectContent>
            {rooms
              ?.filter((room) => room.status === "available")
              .map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.number} - {room.type}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      {/* Additional Fields */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="idProof" className="text-right">
          ID Proof
        </Label>
        <Input
          id="idProof"
          value={idProof}
          onChange={(e) => setIdProof(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Phone
        </Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="idProofImageUrl" className="text-right">
          ID Proof Image URL
        </Label>
        <Input
          id="idProofImageUrl"
          value={idProofImageUrl}
          onChange={(e) => setIdProofImageUrl(e.target.value)}
          className="col-span-3"
        />
      </div>
    </div>
  );
}
