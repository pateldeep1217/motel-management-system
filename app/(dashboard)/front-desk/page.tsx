"use client";

import { useState, useEffect } from "react";
import { isBefore, addDays } from "date-fns";
import { Search, Filter, Loader2 } from "lucide-react";

import { useGetBookings } from "@/features/bookings/api/use-get-bookings";
import { useGetRooms } from "@/features/rooms/api/use-get-rooms";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge, { RoomStatus } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function RoomManagementDashboard() {
  const { toast } = useToast();

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Using hooks to fetch data
  const { data: bookings = [] } = useGetBookings();
  const { data: rooms = [], isLoading: isLoadingRooms } = useGetRooms();

  useEffect(() => {
    const checkOverduePayments = () => {
      const overdueBookings = bookings.filter(
        (booking) =>
          booking.status === "CheckedIn" &&
          booking?.pendingAmount &&
          isBefore(new Date(booking.paymentDueDate ?? ""), new Date())
      );

      overdueBookings.forEach((booking) => {
        toast({
          title: "Overdue Payment",
          description: `Room ${booking.roomNumber} has an overdue payment of $${booking.pendingAmount}`,
          variant: "destructive",
        });
      });
    };

    checkOverduePayments();
  }, [bookings, toast]);

  const getRoomStatusColor = (status: RoomStatus) => {
    const colors = {
      Available: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
      Occupied: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      Reserved: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      "Under Cleaning":
        "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      "Out of Order": "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
    };
    return colors[status] || colors["Out of Order"];
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesStatus =
      filterStatus === "all" ||
      room.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = room.number.toString().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    available: rooms.filter((r) => r.status === "Available").length,
    occupied: rooms.filter((r) => r.status === "Occupied").length,
    reserved: rooms.filter((r) => r.status === "Reserved").length,
    cleaning: rooms.filter((r) => r.status === "Under Cleaning").length,
    total: rooms.length,
  };

  return (
    <div className="flex min-h-screen flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="under cleaning">Under Cleaning</SelectItem>
            <SelectItem value="out of order">Out of Order</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Room Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRooms ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 24 }).map((_, i) => (
                <Skeleton key={i} className="h-[100px]" />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-colors ${getRoomStatusColor(
                      room.status as RoomStatus
                    )}`}
                  >
                    <div className="text-lg font-semibold">
                      Room {room.number}
                    </div>
                    <div className="mb-2 text-sm">{room.status}</div>
                    {room.type === "Kitchenette" && <Badge>Kitchenette</Badge>}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
