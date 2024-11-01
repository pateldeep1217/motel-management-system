"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetRooms } from "@/features/rooms/api/use-get-rooms";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";

import { Loader2 } from "lucide-react";
import AddRoomDialog from "@/features/rooms/component/AddRoomDialog";
export default function RoomPage() {
  const { data: rooms = [], isLoading, error } = useGetRooms();

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
              Error loading rooms: {error.message}
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
          <CardTitle className="text-xl line-clamp-1">Rooms</CardTitle>
          <AddRoomDialog />
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rooms} />
        </CardContent>
      </Card>
    </div>
  );
}
