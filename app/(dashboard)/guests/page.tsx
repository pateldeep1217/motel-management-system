"use client";

import { useState } from "react";
import {
  Search,
  Download,
  RefreshCcw,
  Plus,
  Users,
  UserCheck2,
  UserMinus2,
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
import { useGetGuests } from "@/features/guests/api/use-get-guests";
import { columns } from "./columns";
// import { useNewGuest } from "@/features/guests/hooks/useNewGuest";
import StatCard from "@/features/rooms/component/StatCard";

export default function GuestDashboard() {
  // const { onOpen } = useNewGuest();
  const { data: guests = [], isLoading, error, refetch } = useGetGuests();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuests = guests.filter((guest) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "allowed" && !guest.doNotRent) ||
      (statusFilter === "blacklisted" && guest.doNotRent);
    const matchesSearch = guest.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: guests.length,
    allowed: guests.filter((guest) => !guest.doNotRent).length,
    blacklisted: guests.filter((guest) => guest.doNotRent).length,
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
            Failed to load guests: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Guest Management
          </h2>
          <p className="text-muted-foreground">
            Manage and monitor guest information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Guest
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Guests"
          value={stats.total}
          icon={<Users size={24} />}
          variant="blue"
        />
        <StatCard
          title="Allowed to Rent"
          value={stats.allowed}
          icon={<UserCheck2 size={24} />}
          variant="green"
        />
        <StatCard
          title="Blacklisted"
          value={stats.blacklisted}
          icon={<UserMinus2 size={24} />}
          variant="red"
        />
      </div>

      <Card className="border-0 ">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search guests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9  border-zinc-800 placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]  border-zinc-800">
                  <SelectValue placeholder="All Guests" />
                </SelectTrigger>
                <SelectContent className=" border-zinc-800">
                  <SelectItem value="all">All Guests</SelectItem>
                  <SelectItem value="allowed">Allowed to Rent</SelectItem>
                  <SelectItem value="blacklisted">Blacklisted</SelectItem>
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
          <div className="rounded-lg  border-zinc-800/50">
            <DataTable columns={columns} data={filteredGuests} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
