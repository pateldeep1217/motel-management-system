"use client";

import { useState } from "react";
import {
  Search,
  Download,
  RefreshCcw,
  Plus,
  BedDouble,
  Brush,
  DoorClosed,
  Check,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/DataTable";
import { useGetRooms } from "@/features/rooms/api/use-get-rooms";
import { useGetRoomStatuses } from "@/features/rooms/api/use-get-room-statuses";
import { columns } from "./columns";
import { useNewRoom } from "@/features/rooms/hooks/useNewRoom";
import StatCard from "@/features/rooms/component/StatCard";

export default function RoomDashboard() {
  const { onOpen } = useNewRoom();
  const { data: rooms = [], isLoading, error, refetch } = useGetRooms();
  const { data: roomStatuses = [] } = useGetRoomStatuses();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = rooms.filter((room) => {
    const matchesStatus =
      statusFilter === "all" ||
      room.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesType =
      typeFilter === "all" ||
      room.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesSearch =
      room.number.toString().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: rooms.length,
    available: rooms.filter((room) => room.status === "available").length,
    occupied: rooms.filter((room) => room.status === "occupied").length,
    cleaning: rooms.filter((room) => room.status === "cleaning").length,
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
            Failed to load rooms: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full space-y-8 p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Room Management</h2>
          <p className="text-muted-foreground">
            Manage and monitor room status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={onOpen} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rooms"
          value={stats.total}
          icon={<BedDouble size={24} />}
          variant="blue"
        />
        <StatCard
          title="Available Rooms"
          value={stats.available}
          icon={<DoorClosed size={24} />}
          variant="green"
        />
        <StatCard
          title="Occupied Rooms"
          value={stats.occupied}
          icon={<Check size={24} />}
          variant="red"
        />
        <StatCard
          title="Cleaning"
          value={stats.cleaning}
          icon={<Brush size={24} />}
          variant="amber"
        />
      </div>

      <Card className="border-0">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground  z-10" />
              <Input
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 "
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] ">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {roomStatuses.map((status) => (
                    <SelectItem key={status.status} value={status.status}>
                      {status.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px] ">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="kitchenette">Kitchenette</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="icon"
                onClick={() => refetch()}
                className="h-10 w-10 shrink-0"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DataTable columns={columns} data={filteredRooms} />
        </CardContent>
      </Card>
    </div>
  );
}
