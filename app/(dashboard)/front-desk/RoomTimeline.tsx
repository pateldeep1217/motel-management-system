"use client";

import * as React from "react";
import { addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  guestName: string;
  startDate: Date;
  endDate: Date;
  status: "due-in" | "checked-out" | "due-out" | "checked-in";
}

interface Room {
  id: string;
  number: string;
  bookings: Booking[];
}

const MONTHS = [
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

// Show full month of days instead of just 12
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export function RoomTimeline() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [searchQuery, setSearchQuery] = React.useState("");

  // Extended sample data to better demonstrate the timeline
  const rooms: Room[] = [
    {
      id: "1",
      number: "101",
      bookings: [
        {
          id: "1",
          guestName: "Lewis",
          startDate: new Date(2024, 1, 2),
          endDate: new Date(2024, 1, 4),
          status: "due-in",
        },
        {
          id: "2",
          guestName: "Mark",
          startDate: new Date(2024, 1, 3),
          endDate: new Date(2024, 1, 5),
          status: "checked-out",
        },
      ],
    },
    {
      id: "2",
      number: "102",
      bookings: [
        {
          id: "3",
          guestName: "Sarah",
          startDate: new Date(2024, 1, 5),
          endDate: new Date(2024, 1, 8),
          status: "checked-in",
        },
      ],
    },
    {
      id: "3",
      number: "103",
      bookings: [
        {
          id: "4",
          guestName: "James",
          startDate: new Date(2024, 1, 1),
          endDate: new Date(2024, 1, 3),
          status: "due-out",
        },
      ],
    },
  ];

  const filteredRooms = rooms.filter((room) =>
    room.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-semibold">Front desk</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-sm text-muted-foreground">Due in</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-sm text-muted-foreground">Checked out</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-sm text-muted-foreground">Due out</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm text-muted-foreground">Checked in</span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by room number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[240px]"
            />
          </div>
          <Button>Create booking</Button>
        </div>
      </div>
      <div className="flex border-b">
        <div className="w-16 shrink-0 border-r p-2 flex items-center justify-center">
          <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        {MONTHS.map((month, i) => (
          <div
            key={month}
            className={cn(
              "flex-1 text-center p-2 font-medium",
              i === currentDate.getMonth() &&
                "text-primary bg-primary/5 rounded-sm"
            )}
          >
            {month}
          </div>
        ))}
        <div className="w-16 shrink-0 border-l p-2 flex items-center justify-center">
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex border-b">
        <div className="w-16 shrink-0 border-r" />
        {DAYS.map((day) => (
          <div
            key={day}
            className={cn(
              "flex-1 text-center p-2 text-sm text-muted-foreground",
              day === currentDate.getDate() && "font-medium text-primary"
            )}
          >
            {day}
          </div>
        ))}
        <div className="w-16 shrink-0 border-l" />
      </div>
      <div className="flex-1 overflow-auto">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="flex border-b min-h-[100px] relative group"
          >
            <div className="w-16 shrink-0 border-r p-2 flex items-center justify-center font-medium">
              {room.number}
            </div>
            <div className="flex-1 relative">
              {room.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={cn(
                    "absolute top-2 h-8 rounded-full px-2 flex items-center text-sm font-medium cursor-pointer transition-opacity hover:opacity-80",
                    booking.status === "due-in" &&
                      "bg-orange-100 text-orange-700",
                    booking.status === "checked-out" &&
                      "bg-blue-100 text-blue-700",
                    booking.status === "due-out" && "bg-red-100 text-red-700",
                    booking.status === "checked-in" &&
                      "bg-green-100 text-green-700"
                  )}
                  style={{
                    left: `${(booking.startDate.getDate() - 1) * (100 / 31)}%`,
                    width: `${
                      ((booking.endDate.getDate() -
                        booking.startDate.getDate() +
                        1) *
                        100) /
                      31
                    }%`,
                  }}
                >
                  {booking.guestName}
                </div>
              ))}
            </div>
            <div className="w-16 shrink-0 border-l" />
          </div>
        ))}
      </div>
    </div>
  );
}
