"use client";

import { useState, useEffect } from "react";
import { format, addDays, isBefore } from "date-fns";
import {
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  PieChart,
  Settings,
  Users,
  Clock,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

import { useGetBookings } from "@/features/bookings/api/use-get-bookings";
import { useGetRooms } from "@/features/rooms/api/use-get-rooms";
import { useCreateBooking } from "@/features/bookings/api/use-create-booking";
import { useEditBooking } from "@/features/bookings/api/use-edit-booking";
import { useEditRoom } from "@/features/rooms/api/use-edit-room";
import { useGetBookingStatuses } from "@/features/bookings/api/use-get-booking-statuses";
import useCheckIn from "@/features/bookings/api/use-check-in";
import useCheckOut from "@/features/bookings/api/use-check-out";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BookingDetailsModal } from "@/features/bookings/components/BookingDetailsModal";
import { RoomDetailsModal } from "@/features/bookings/components/RoomDetailsModal";
import { CheckInFormModal } from "@/features/bookings/components/CheckInFormModal";
import { ExtendStayModal } from "@/features/bookings/components/ExtendStayModal";
import { PaymentModal } from "@/features/bookings/components/PaymentModal";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

type BookingResponseType = InferResponseType<
  (typeof client.api.bookings)["$post"],
  200
>["data"];

type RoomResponseType = InferResponseType<
  (typeof client.api.rooms)["$post"],
  200
>["data"];
export default function RoomManagementDashboard() {
  const { toast } = useToast();

  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponseType | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomResponseType | null>(
    null
  );
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isExtendStayModalOpen, setIsExtendStayModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: bookings = [], isLoading: isLoadingBookings } =
    useGetBookings();
  const { data: rooms = [], isLoading: isLoadingRooms } = useGetRooms();
  const { mutateAsync: createBooking, isLoading: isCreatingBooking } =
    useCreateBooking();
  const { mutateAsync: editBooking } = useEditBooking();
  const { mutateAsync: editRoom } = useEditRoom();
  const { data: bookingStatuses = [] } = useGetBookingStatuses();
  const { mutateAsync: checkIn, isLoading: isCheckingIn } = useCheckIn();
  const { mutateAsync: checkOut, isLoading: isCheckingOut } = useCheckOut();

  const availableRooms = rooms.filter((room) => room.status === "Available");

  useEffect(() => {
    const checkOverduePayments = () => {
      const overdueBookings = bookings.filter(
        (booking) =>
          booking.status === "CheckedIn" &&
          booking.pendingAmount > 0 &&
          isBefore(new Date(booking.paymentDueDate), new Date())
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
    const interval = setInterval(checkOverduePayments, 24 * 60 * 60 * 1000); // Check daily

    return () => clearInterval(interval);
  }, [bookings, toast]);

  const handleCheckIn = async (data) => {
    try {
      const confirmedStatus = bookingStatuses.find(
        (status) => status.status === "Confirmed"
      );

      if (!confirmedStatus) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Booking status not found.",
        });
        return;
      }

      const checkInDate = data.checkInDate
        ? new Date(data.checkInDate)
        : new Date();
      const checkOutDate = data.checkOutDate
        ? new Date(data.checkOutDate)
        : new Date();

      const newBooking = await createBooking({
        roomId: data.roomId,
        guestName: data.guestName,
        checkInDate,
        checkOutDate,
        bookingStatusId: confirmedStatus.id,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
        pendingAmount: data.totalAmount - data.paidAmount,
        paymentDueDate: addDays(checkInDate, data.isWeeklyRate ? 7 : 1),
        paymentMethod: data.paymentMethod,
        dailyRate: data.dailyRate,
        isWeeklyRate: data.isWeeklyRate,
      });

      if (newBooking?.id) {
        await checkIn({ bookingId: newBooking.id });
        setIsCheckInModalOpen(false);
        toast({
          title: "Success",
          description: "Check-in completed successfully.",
        });
      } else {
        throw new Error("Booking creation failed");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete check-in.",
      });
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      await checkOut({ bookingId });
      setIsBookingModalOpen(false);
      toast({
        title: "Success",
        description: "Check-out completed successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete check-out.",
      });
    }
  };

  const handleExtendStay = async (
    bookingId,
    newCheckOutDate,
    additionalAmount
  ) => {
    try {
      const updatedBooking = await editBooking({
        id: bookingId,
        checkOutDate: newCheckOutDate,
        totalAmount: selectedBooking.totalAmount + additionalAmount,
        pendingAmount: selectedBooking.pendingAmount + additionalAmount,
      });

      setSelectedBooking(updatedBooking);
      setIsExtendStayModalOpen(false);
      toast({
        title: "Success",
        description: "Stay extended successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to extend stay.",
      });
    }
  };

  const handlePayment = async (bookingId, amount) => {
    try {
      const updatedBooking = await editBooking({
        id: bookingId,
        paidAmount: selectedBooking.paidAmount + amount,
        pendingAmount: selectedBooking.pendingAmount - amount,
        paymentDueDate: addDays(
          new Date(),
          selectedBooking.isWeeklyRate ? 7 : 1
        ),
      });

      setSelectedBooking(updatedBooking);
      setIsPaymentModalOpen(false);
      toast({
        title: "Success",
        description: `Payment of $${amount} processed successfully.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment.",
      });
    }
  };

  const handleRoomClick = (room) => {
    if (room.status === "Occupied" || room.status === "Reserved") {
      const booking = bookings.find(
        (b) =>
          b.roomId === room.id &&
          (b.status === "CheckedIn" || b.status === "Reserved")
      );
      if (booking) {
        setSelectedBooking(booking);
        setIsBookingModalOpen(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No active booking found for this room.",
        });
      }
    } else {
      setSelectedRoom(room);
      setIsRoomModalOpen(true);
    }
  };

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
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
        <div className="flex items-center gap-4">
          {Object.keys(getRoomStatusColor).map((status) => (
            <Badge key={status} variant="outline" className="gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  getRoomStatusColor(status as RoomStatus).split(" ")[0]
                }`}
              />
              {status}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
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

          <Card>
            <CardHeader>
              <CardTitle>Room Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingRooms ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-[100px]" />
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {filteredRooms.map((room) => (
                      <div
                        key={room.id}
                        className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-colors ${getRoomStatusColor(
                          room.status
                        )} cursor-pointer`}
                        onClick={() => handleRoomClick(room)}
                      >
                        <div className="text-lg font-semibold">
                          Room {room.number}
                        </div>
                        <div className="mb-2 text-sm">{room.status}</div>
                        {room.type === "Kitchenette" && (
                          <Badge variant="secondary">Kitchenette</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start"
                onClick={() => setIsCheckInModalOpen(true)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                New Check-In / Reservation
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Bookings Calendar
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Housekeeping Schedule
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Guest Directory
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                View Overdue Payments
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {stats.available}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Occupied</p>
                  <p className="text-2xl font-bold text-red-500">
                    {stats.occupied}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Reserved</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {stats.reserved}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Cleaning</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {stats.cleaning}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Rooms</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedBooking(null);
        }}
        onCheckOut={handleCheckOut}
        onExtendStay={() => setIsExtendStayModalOpen(true)}
        onMakePayment={() => setIsPaymentModalOpen(true)}
        isCheckingOut={isCheckingOut}
      />

      <RoomDetailsModal
        room={selectedRoom}
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          setSelectedRoom(null);
        }}
        onCheckIn={(roomId) => {
          setIsRoomModalOpen(false);
          setIsCheckInModalOpen(true);
        }}
      />

      <CheckInFormModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onSubmit={handleCheckIn}
        availableRooms={availableRooms}
        isSubmitting={isCreatingBooking || isCheckingIn}
      />

      <ExtendStayModal
        isOpen={isExtendStayModalOpen}
        onClose={() => setIsExtendStayModalOpen(false)}
        onSubmit={handleExtendStay}
        booking={selectedBooking}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePayment}
        booking={selectedBooking}
      />
    </div>
  );
}
