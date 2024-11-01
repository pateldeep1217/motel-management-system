import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  CalendarCheck,
  CalendarClock,
  Wallet,
  TrendingUp,
  BadgePercent,
  Calendar,
} from "lucide-react";

export default function Home() {
  const todayStats = {
    totalRevenue: 2580,
    occupancyRate: 85,
    avgDailyRate: 145,
    pendingCheckIns: 8,
    pendingCheckOuts: 6,
    newBookings: 12,
  };

  const upcomingCheckIns = [
    { id: 1, guest: "John Smith", room: "101", time: "14:00", status: "Paid" },
    {
      id: 2,
      guest: "Mary Johnson",
      room: "205",
      time: "15:30",
      status: "Pending",
    },
    {
      id: 3,
      guest: "Robert Davis",
      room: "103",
      time: "16:00",
      status: "Paid",
    },
  ];

  const upcomingCheckOuts = [
    {
      id: 1,
      guest: "Alice Brown",
      room: "302",
      time: "11:00",
      status: "Confirmed",
    },
    {
      id: 2,
      guest: "James Wilson",
      room: "104",
      time: "10:30",
      status: "Late",
    },
  ];

  const recentBookings = [
    {
      id: 1,
      guest: "Sarah Parker",
      dates: "Nov 5-7",
      room: "Deluxe",
      amount: 450,
    },
    {
      id: 2,
      guest: "Mike Anderson",
      dates: "Nov 6-8",
      room: "Standard",
      amount: 320,
    },
    {
      id: 3,
      guest: "Emma Davis",
      dates: "Nov 7-9",
      room: "Suite",
      amount: 680,
    },
  ];

  return (
    <div className="min-h-screen  text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
          <div className="flex items-center gap-4 text-gray-400">
            <Calendar className="w-5 h-5" />
            <span>November 1, 2024</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0B0F17] rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Today's Revenue</p>
                <p className="text-2xl font-semibold mt-1">
                  ${todayStats.totalRevenue}
                </p>
                <div className="flex items-center mt-2 text-green-400 text-sm">
                  <span>↑ 12% vs yesterday</span>
                </div>
              </div>
              <Wallet className="w-6 h-6 text-blue-400 opacity-80" />
            </div>
          </div>

          <div className="bg-[#0B0F17] rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Occupancy Rate</p>
                <p className="text-2xl font-semibold mt-1">
                  {todayStats.occupancyRate}%
                </p>
                <div className="flex items-center mt-2 text-green-400 text-sm">
                  <span>↑ 5% vs last week</span>
                </div>
              </div>
              <BadgePercent className="w-6 h-6 text-green-400 opacity-80" />
            </div>
          </div>

          <div className="bg-[#0B0F17] rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Average Daily Rate</p>
                <p className="text-2xl font-semibold mt-1">
                  ${todayStats.avgDailyRate}
                </p>
                <div className="flex items-center mt-2 text-red-400 text-sm">
                  <span>↓ 3% vs last month</span>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-400 opacity-80" />
            </div>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Today's Check-ins */}
          <div className="bg-[#0B0F17] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Today's Check-ins</h2>
                <p className="text-sm text-gray-400">
                  {todayStats.pendingCheckIns} guests arriving
                </p>
              </div>
              <CalendarCheck className="w-6 h-6 text-green-400 opacity-80" />
            </div>
            <div className="space-y-3">
              {upcomingCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="bg-[#0f1217] rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{checkIn.guest}</p>
                      <p className="text-sm text-gray-400">
                        Room {checkIn.room} • {checkIn.time}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        checkIn.status === "Paid"
                          ? "bg-green-400/10 text-green-400"
                          : "bg-yellow-400/10 text-yellow-400"
                      }`}
                    >
                      {checkIn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Check-outs */}
          <div className="bg-[#0B0F17] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Today's Check-outs</h2>
                <p className="text-sm text-gray-400">
                  {todayStats.pendingCheckOuts} departures scheduled
                </p>
              </div>
              <CalendarClock className="w-6 h-6 text-red-400 opacity-80" />
            </div>
            <div className="space-y-3 ">
              {upcomingCheckOuts.map((checkOut) => (
                <div key={checkOut.id} className="bg-[#0f1217] rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{checkOut.guest}</p>
                      <p className="text-sm text-gray-400">
                        Room {checkOut.room} • {checkOut.time}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        checkOut.status === "Confirmed"
                          ? "bg-green-400/10 text-green-400"
                          : "bg-red-400/10 text-red-400"
                      }`}
                    >
                      {checkOut.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-[#0B0F17] rounded-lg p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Recent Bookings</h2>
                <p className="text-sm text-gray-400">
                  {todayStats.newBookings} new bookings today
                </p>
              </div>
              <Users className="w-6 h-6 text-blue-400 opacity-80" />
            </div>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="bg-[#0f1217] rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{booking.guest}</p>
                      <p className="text-sm text-gray-400">{booking.dates}</p>
                    </div>
                    <div className="flex-1 text-center text-gray-400">
                      {booking.room}
                    </div>
                    <div className="flex-1 text-right font-medium">
                      ${booking.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
