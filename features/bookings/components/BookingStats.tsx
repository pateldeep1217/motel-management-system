"use client";

import { useState, useMemo } from "react";
import { DollarSign, Percent, BedDouble, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.bookings)["$post"],
  200
>["data"];

type TimePeriod = "daily" | "weekly" | "monthly" | "yearly";

export default function ImprovedBookingStats({
  bookings = [],
}: {
  bookings: ResponseType[];
}) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("daily");
  console.log("Booking dailyRate:", bookings);

  const stats = useMemo(() => {
    const today = new Date();

    // Function to get the starting date of the period based on time period
    const getPeriodStart = (date: Date, period: TimePeriod) => {
      const newDate = new Date(date);
      switch (period) {
        case "daily":
          newDate.setHours(0, 0, 0, 0);
          break;
        case "weekly":
          newDate.setDate(newDate.getDate() - newDate.getDay());
          newDate.setHours(0, 0, 0, 0);
          break;
        case "monthly":
          newDate.setDate(1);
          newDate.setHours(0, 0, 0, 0);
          break;
        case "yearly":
          newDate.setMonth(0, 1);
          newDate.setHours(0, 0, 0, 0);
          break;
      }
      return newDate;
    };

    const periodStart = getPeriodStart(today, timePeriod);
    const periodEnd = new Date(today); // Correct end for accurate filtering
    const previousPeriodStart = new Date(periodStart);

    switch (timePeriod) {
      case "daily":
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
        break;
      case "weekly":
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        break;
      case "monthly":
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
        break;
      case "yearly":
        previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1);
        break;
    }

    const calculateStats = (start: Date, end: Date) => {
      const periodBookings = bookings.filter(
        (booking) =>
          new Date(booking.checkInDate) < end &&
          new Date(booking.checkOutDate) > start
      );

      console.log(`Filtered bookings for ${timePeriod}:`, periodBookings);

      const totalNights =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      let occupiedRoomNights = 0;
      let revenue = 0;

      periodBookings.forEach((booking) => {
        const bookingStart = new Date(
          Math.max(start.getTime(), new Date(booking.checkInDate).getTime())
        );
        const bookingEnd = new Date(
          Math.min(end.getTime(), new Date(booking.checkOutDate).getTime())
        );

        const nights =
          (bookingEnd.getTime() - bookingStart.getTime()) /
          (1000 * 60 * 60 * 24);
        occupiedRoomNights += nights;
        revenue += nights * Number(booking.dailyRate);
      });

      const totalRooms = 23;
      const occupancyRate =
        (occupiedRoomNights / (totalNights * totalRooms)) * 100;
      const averageRate =
        occupiedRoomNights > 0 ? revenue / occupiedRoomNights : 0;

      return { occupiedRoomNights, revenue, occupancyRate, averageRate };
    };

    const currentStats = calculateStats(periodStart, periodEnd);
    const previousStats = calculateStats(previousPeriodStart, periodStart);

    const revenueChange = previousStats.revenue
      ? parseFloat(
          (
            ((currentStats.revenue - previousStats.revenue) /
              previousStats.revenue) *
            100
          ).toFixed(2)
        )
      : 0;
    const occupancyChange = previousStats.occupancyRate
      ? parseFloat(
          (
            ((currentStats.occupancyRate - previousStats.occupancyRate) /
              previousStats.occupancyRate) *
            100
          ).toFixed(2)
        )
      : 0;

    console.log("Current Stats:", currentStats);
    console.log("Previous Stats:", previousStats);

    return {
      ...currentStats,
      revenueChange,
      occupancyChange,
    };
  }, [bookings, timePeriod]);

  console.log("revenue", stats.revenue);
  console.log("averageRate", stats.averageRate);
  console.log("occupancyRate", stats.occupancyRate);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Select
          value={timePeriod}
          onValueChange={(value: TimePeriod) => setTimePeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={`${
            timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)
          } Revenue`}
          value={`$${stats.revenue.toFixed(2)}`}
          icon={DollarSign}
          trend={{
            value: stats.revenueChange,
            label: `vs previous ${timePeriod}`,
          }}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate.toFixed(1)}%`}
          icon={Percent}
          trend={{
            value: stats.occupancyChange,
            label: `vs previous ${timePeriod}`,
          }}
        />
        <StatCard
          title="Room Nights Occupied"
          value={stats.occupiedRoomNights.toFixed(0)}
          icon={BedDouble}
        />
        <StatCard
          title="Average Daily Rate"
          value={`$${stats.averageRate.toFixed(2)}`}
          icon={TrendingUp}
        />
      </div>
    </>
  );
}
