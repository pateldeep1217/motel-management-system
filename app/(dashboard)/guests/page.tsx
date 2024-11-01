"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Download,
  Loader2,
  RefreshCcw,
  UserCheck2,
  UserMinus2,
  Users,
} from "lucide-react";
import { useGetGuests } from "@/features/guests/api/use-get-guests";
import AddGuestDialog from "@/features/guests/api/components/AddGuestDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function GuestsPage() {
  const { data: guests = [], isLoading, error, refetch } = useGetGuests();
  const [rentFilter, setRentFilter] = useState<string>("all");

  const filteredGuests = guests.filter((guest) => {
    if (rentFilter === "all") return true;
    if (rentFilter === "allowed") return !guest.doNotRent;
    return guest.doNotRent;
  });

  const totalGuests = guests.length;
  const allowedGuests = guests.filter((guest) => !guest.doNotRent).length;
  const blacklistedGuests = guests.filter((guest) => guest.doNotRent).length;

  if (isLoading) {
    return (
      <div>
        <Card className="border-none drop-shadow-sm bg-transparent">
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Card className="border-none drop-shadow-sm bg-transparent">
          <CardHeader>
            <CardTitle className="text-xl text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-red-500">
              Error loading guests: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3  ">
        <Card className="bg-[#0B0F17]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuests}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0B0F17]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Allowed to Rent
            </CardTitle>
            <UserCheck2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {allowedGuests}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0B0F17]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blacklisted</CardTitle>
            <UserMinus2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {blacklistedGuests}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-none drop-shadow-sm bg-transparent">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <CardTitle className="text-xl line-clamp-1">Guests</CardTitle>
            <div className="flex flex-1 items-center gap-2">
              <Input placeholder="Search guests..." className="max-w-[250px]" />
              <Select value={rentFilter} onValueChange={setRentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Guests</SelectItem>
                  <SelectItem value="allowed">Allowed to Rent</SelectItem>
                  <SelectItem value="blacklisted">Blacklisted</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => refetch()}>
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <AddGuestDialog />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredGuests} />
        </CardContent>
      </Card>
    </div>
  );
}
