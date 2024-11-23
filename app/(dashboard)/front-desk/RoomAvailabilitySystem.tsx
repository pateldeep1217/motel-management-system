"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCheckIn,
  useCheckOut,
} from "@/features/bookings/api/use-check-in-out";
import { useGetRooms } from "@/features/rooms/api/use-get-rooms";
import { useGetBookings } from "@/features/bookings/api/use-get-bookings";
import { toast } from "@/components/ui/use-toast";

type Room = {
  id: string;
  number: string;
  type: string;
  status: "available" | "occupied" | "maintenance";
};

type Booking = {
  id: string;
  roomId: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  status: "booked" | "checked-in" | "checked-out";
};

export function RoomAvailabilitySystem() {
  const { data: rooms = [], isLoading: isLoadingRooms } = useGetRooms();
  const { data: bookings = [], isLoading: isLoadingBookings } =
    useGetBookings();
  const { mutate: checkIn } = useCheckIn();
  const { mutate: checkOut } = useCheckOut();

  const [roomStatus, setRoomStatus] = useState<Record<string, Room["status"]>>(
    {}
  );

  useEffect(() => {
    const newRoomStatus: Record<string, Room["status"]> = {};
    rooms.forEach((room) => {
      const booking = bookings.find(
        (b) => b.roomId === room.id && b.status !== "checked-out"
      );
      newRoomStatus[room.id] = booking ? "occupied" : "available";
    });
    setRoomStatus(newRoomStatus);
  }, [rooms, bookings]);

  const handleCheckIn = (bookingId: string, roomId: string) => {
    checkIn(bookingId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Guest checked in successfully",
        });
        setRoomStatus((prev) => ({ ...prev, [roomId]: "occupied" }));
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to check in",
          variant: "destructive",
        });
      },
    });
  };

  const handleCheckOut = (bookingId: string, roomId: string) => {
    checkOut(bookingId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Guest checked out successfully",
        });
        setRoomStatus((prev) => ({ ...prev, [roomId]: "available" }));
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to check out",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoadingRooms || isLoadingBookings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Room Availability</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className={`${
              roomStatus[room.id] === "available"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            <CardContent className="p-4">
              <h4 className="font-semibold">Room {room.number}</h4>
              <p>Type: {room.type}</p>
              <p>Status: {roomStatus[room.id]}</p>
              {roomStatus[room.id] === "occupied" && (
                <div className="mt-2">
                  {bookings
                    .filter(
                      (b) => b.roomId === room.id && b.status === "checked-in"
                    )
                    .map((booking) => (
                      <div key={booking.id} className="text-sm">
                        <p>Guest: {booking.guestName}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckOut(booking.id, room.id)}
                          className="mt-1"
                        >
                          Check Out
                        </Button>
                      </div>
                    ))}
                </div>
              )}
              {roomStatus[room.id] === "available" && (
                <div className="mt-2">
                  {bookings
                    .filter(
                      (b) => b.roomId === room.id && b.status === "booked"
                    )
                    .map((booking) => (
                      <div key={booking.id} className="text-sm">
                        <p>Upcoming: {booking.guestName}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckIn(booking.id, room.id)}
                          className="mt-1"
                        >
                          Check In
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
