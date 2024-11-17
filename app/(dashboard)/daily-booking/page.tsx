"use client";

import { useState, useEffect } from "react";
import { useGetBookings } from "@/features/bookings/api/use-get-bookings";
import { calculateDailyTotals } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CreditCard,
} from "lucide-react";

export default function DailyBookings() {
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

  const getDateRange = () => {
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
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.checkInDate);
    const { start, end } = getDateRange();
    const isInRange = bookingDate >= start && bookingDate <= end;
    const matchesFilter =
      booking.guestName.toLowerCase().includes(filterValue.toLowerCase()) ||
      booking.roomNumber.toString().includes(filterValue);
    return isInRange && matchesFilter;
  });

  const totals = calculateDailyTotals(filteredBookings);

  const formatDateMMDDYYYY = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const getDateDisplay = () => {
    const { start, end } = getDateRange();
    if (viewMode === "daily") {
      return formatDateMMDDYYYY(start);
    } else {
      return `${formatDateMMDDYYYY(start)} - ${formatDateMMDDYYYY(end)}`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Bookings</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => updateDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">{getDateDisplay()}</span>
          <Button variant="outline" size="icon" onClick={() => updateDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by guest name or room number..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="max-w-sm mr-4"
          />
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Room Number</TableHead>
                <TableHead>Guest Name</TableHead>
                <TableHead>Check-In Date</TableHead>
                <TableHead>Check-Out Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {booking.roomNumber}
                  </TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>
                    {formatDateMMDDYYYY(new Date(booking.checkInDate))}
                  </TableCell>
                  <TableCell>
                    {formatDateMMDDYYYY(new Date(booking.checkOutDate))}
                  </TableCell>
                  <TableCell>{booking.paymentMethod}</TableCell>
                  <TableCell className="text-right">
                    ${parseFloat(booking.totalAmount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <div className="grid grid-cols-3 bg-muted/50 rounded-b-lg overflow-hidden">
                    <div className="p-4 flex flex-col items-center justify-center border-r border-border">
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Cash Total</span>
                      </div>
                      <span className="text-lg font-bold">
                        ${totals.cash.toFixed(2)}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col items-center justify-center border-r border-border">
                      <div className="flex items-center space-x-2 mb-1">
                        <CreditCard className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Card Total</span>
                      </div>
                      <span className="text-lg font-bold">
                        ${totals.card.toFixed(2)}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col items-center justify-center bg-muted">
                      <span className="text-sm font-medium mb-1">
                        Grand Total
                      </span>
                      <span className="text-lg font-bold ">
                        ${(totals.cash + totals.card).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
