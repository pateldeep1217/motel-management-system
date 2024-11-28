"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useGetBookings } from "@/features/bookings/api/use-get-bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/DataTable";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  DollarSign,
  BedDouble,
  Percent,
  TrendingUp,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";
import { columns } from "./columns";

export default function BookingDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("daily");
  const [filterValue, setFilterValue] = useState("");
  const { data: bookings = [], refetch: refetchBookings } = useGetBookings();

  useEffect(() => {
    refetchBookings();
  }, [currentDate, refetchBookings]);

  const updateDate = (days: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };
  const getDateRange = useCallback(() => {
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(currentDate);
    end.setHours(23, 59, 59, 999);
    if (viewMode === "weekly") {
      end.setDate(end.getDate() + 6);
    } else if (viewMode === "monthly") {
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }
    return { start, end };
  }, [currentDate, viewMode]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.checkInDate);
      const { start, end } = getDateRange();
      const isInRange = bookingDate >= start && bookingDate <= end;
      const matchesFilter =
        booking.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        booking.id.toLowerCase().includes(filterValue.toLowerCase());
      return isInRange && matchesFilter;
    });
  }, [bookings, filterValue, getDateRange]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const { metrics, totals } = useMemo(() => {
    const totalRevenue = filteredBookings.reduce(
      (sum, booking) => sum + parseFloat(booking.totalAmount),
      0
    );
    const occupiedRooms = new Set(
      filteredBookings.map((booking) => booking.roomNumber)
    ).size;
    const totalRooms = 100; // Assuming 100 total rooms, adjust as needed

    const cashTotal = filteredBookings
      .filter((booking) => booking.paymentMethod === "Cash")
      .reduce((sum, booking) => sum + parseFloat(booking.totalAmount), 0);

    const cardTotal = filteredBookings
      .filter((booking) => booking.paymentMethod === "Card")
      .reduce((sum, booking) => sum + parseFloat(booking.totalAmount), 0);

    return {
      metrics: {
        dailyRevenue: totalRevenue,
        occupancyRate: (occupiedRooms / totalRooms) * 100,
        roomNightsOccupied: occupiedRooms,
        averageDailyRate: occupiedRooms > 0 ? totalRevenue / occupiedRooms : 0,
      },
      totals: {
        cash: cashTotal,
        card: cardTotal,
        grand: cashTotal + cardTotal,
      },
    };
  }, [filteredBookings]);

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Add bookings data
    const bookingsWorksheet = XLSX.utils.json_to_sheet(filteredBookings);
    XLSX.utils.book_append_sheet(workbook, bookingsWorksheet, "Bookings");

    // Add totals data
    const totalsData = [
      { Label: "Cash Total", Value: totals.cash },
      { Label: "Card Total", Value: totals.card },
      { Label: "Grand Total", Value: totals.grand },
    ];
    const totalsWorksheet = XLSX.utils.json_to_sheet(totalsData);
    XLSX.utils.book_append_sheet(workbook, totalsWorksheet, "Totals");

    const footerData = [
      [], // Empty row for spacing
      ["Cash Total", totals.cash],
      ["Card Total", totals.card],
      ["Grand Total", totals.grand],
    ];
    XLSX.utils.sheet_add_aoa(bookingsWorksheet, footerData, { origin: -1 });

    // Generate Excel file
    XLSX.writeFile(workbook, "bookings_report.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Booking Overview
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => updateDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg">{formatDate(currentDate)}</span>
          <Button variant="outline" size="icon" onClick={() => updateDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-sm font-medium">Daily Revenue</span>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            ${metrics.dailyRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-green-500">↑ 0% vs previous {viewMode}</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-sm font-medium">Occupancy Rate</span>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            {metrics.occupancyRate.toFixed(1)}%
          </div>
          <p className="text-xs text-green-500">↑ 0% vs previous {viewMode}</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-sm font-medium">Room Nights Occupied</span>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{metrics.roomNightsOccupied}</div>
          <p className="text-xs text-green-500">↑ 0% vs previous {viewMode}</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-sm font-medium">Average Daily Rate</span>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            ${metrics.averageDailyRate.toFixed(2)}
          </div>
          <p className="text-xs text-green-500">↑ 0% vs previous {viewMode}</p>
        </div>
      </div>

      <div className="rounded-lg  bg-card">
        <div className="flex items-center p-4 gap-4">
          <Input
            placeholder="Search bookings..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="max-w-sm"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetchBookings()}
            className="ml-auto"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={filteredBookings}
          showTotals={true}
          totals={totals}
        />
      </div>
    </div>
  );
}
