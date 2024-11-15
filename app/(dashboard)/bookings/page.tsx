"use client";

import { useMemo, useState } from "react";
import { utils, writeFile } from "xlsx";
import {
  Download,
  RefreshCcw,
  Plus,
  Calendar,
  UserCheck,
  DoorClosed,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { useGetBookings } from "@/features/bookings/api/use-get-bookings";
import { columns } from "./columns";
import { useNewBooking } from "@/features/bookings/hooks/useNewBooking";
import StatCard from "@/components/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { useGetBookingStatuses } from "@/features/bookings/api/use-get-booking-statuses";

export default function BookingDashboard() {
  const { onOpen } = useNewBooking();
  const { data: bookings = [], isLoading, error, refetch } = useGetBookings();
  const { data: bookingStatuses = [] } = useGetBookingStatuses();

  console.log(bookings);
  console.log(bookingStatuses);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<
    { from: Date; to: Date } | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      console.log("Booking Status:", booking.status);
      console.log("Booking Status ID:", booking.statusId);
      console.log("Status Filter:", statusFilter);

      const matchesStatus =
        statusFilter === "all" || booking.statusId === statusFilter; // Use statusId for comparison
      const matchesDateRange =
        !dateRange ||
        (new Date(booking.checkInDate) >= dateRange.from &&
          new Date(booking.checkOutDate) <= dateRange.to);
      const matchesSearch =
        booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase());

      console.log("Matches Status:", matchesStatus);
      console.log("Matches Date Range:", matchesDateRange);
      console.log("Matches Search:", matchesSearch);

      return matchesStatus && matchesDateRange && matchesSearch;
    });
  }, [bookings, statusFilter, dateRange, searchQuery]);

  const stats = useMemo(
    () => ({
      total: bookings.length,
      upcoming: bookings.filter(
        (booking) => new Date(booking.checkInDate) > new Date()
      ).length,
      active: bookings.filter(
        (booking) =>
          new Date(booking.checkInDate) <= new Date() &&
          new Date(booking.checkOutDate) >= new Date()
      ).length,
      completed: bookings.filter(
        (booking) => new Date(booking.checkOutDate) < new Date()
      ).length,
    }),
    [bookings]
  );

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(filteredBookings);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Bookings");
    writeFile(wb, "bookings.xlsx");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            Failed to load bookings: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Booking Management
          </h2>
          <p className="text-muted-foreground">
            Manage and monitor booking status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={onOpen} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Bookings" value={stats.total} icon={Calendar} />
        <StatCard
          title="Upcoming Bookings"
          value={stats.upcoming}
          icon={UserCheck}
        />
        <StatCard
          title="Active Bookings"
          value={stats.active}
          icon={DoorClosed}
        />
        <StatCard
          title="Completed Bookings"
          value={stats.completed}
          icon={CreditCard}
        />
      </div>

      <Card className="border-0">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {bookingStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DateRangePicker value={dateRange} onValueChange={setDateRange} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetch()}
                className="h-10 w-10 shrink-0 bg-background border border-input"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DataTable columns={columns} data={filteredBookings} />
        </CardContent>
      </Card>
    </div>
  );
}
