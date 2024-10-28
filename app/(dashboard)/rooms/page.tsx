"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetRooms } from "@/features/motels/api/use-get-rooms";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <CardTitle className="text-xl line-clamp-1">Room Page</CardTitle>
          <Button size="sm">
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rooms} />
        </CardContent>
      </Card>
    </div>
  );
}
