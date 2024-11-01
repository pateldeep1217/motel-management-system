"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";

import { Loader2 } from "lucide-react";

import AddRoomDialog from "@/features/rooms/component/AddRoomDialog";
import { useGetGuests } from "@/features/guests/api/use-get-guests";
import AddGuestDialog from "@/features/guests/api/components/AddGuestDialog";

export default function GuestsPage() {
  const { data: rooms = [], isLoading, error } = useGetGuests();

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
    <div className="">
      <Card className="border-none drop-shadow-sm bg-transparent">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Guests</CardTitle>
          <AddGuestDialog />
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rooms} />
        </CardContent>
      </Card>
    </div>
  );
}
