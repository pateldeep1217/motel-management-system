// "use client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useGetRooms } from "@/features/rooms/api/use-get-rooms";
// import { columns } from "./columns";
// import { DataTable } from "@/components/DataTable";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Download, Loader2, Plus, RefreshCcw } from "lucide-react";
// import AddRoomDialog from "@/features/rooms/component/AddRoomDialog";
// import { useState } from "react";

// export default function RoomPage() {
//   const { data: rooms = [], isLoading, error, refetch } = useGetRooms();
//   const [statusFilter, setStatusFilter] = useState<string>("all");

//   const filteredRooms = rooms.filter((room) => {
//     if (statusFilter === "all") return true;
//     return room.status === statusFilter;
//   });

//   const totalRooms = rooms.length;
//   const availableRooms = rooms.filter(
//     (room) => room.status === "available"
//   ).length;
//   const occupiedRooms = rooms.filter(
//     (room) => room.status === "occupied"
//   ).length;
//   const cleaningRooms = rooms.filter(
//     (room) => room.status === "cleaning"
//   ).length;

//   if (isLoading) {
//     return (
//       <div>
//         <Card className="border-none drop-shadow-sm bg-transparent">
//           <CardContent>
//             <div className="h-[500px] w-full flex items-center justify-center">
//               <Loader2 className="size-6 text-slate-300 animate-spin" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <Card className="border-none drop-shadow-sm bg-transparent">
//           <CardHeader>
//             <CardTitle className="text-xl text-red-500">Error</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-center text-red-500">
//               Error loading rooms: {error.message}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Stats Overview */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalRooms}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Available</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-500">
//               {availableRooms}
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Occupied</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-500">
//               {occupiedRooms}
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Cleaning</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-yellow-500">
//               {cleaningRooms}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Content */}
//       <Card className="border-none drop-shadow-sm bg-transparent">
//         <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
//             <CardTitle className="text-xl line-clamp-1">Rooms</CardTitle>
//             <div className="flex flex-1 items-center gap-2">
//               <Input placeholder="Search rooms..." className="max-w-[250px]" />
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="available">Available</SelectItem>
//                   <SelectItem value="occupied">Occupied</SelectItem>
//                   <SelectItem value="cleaning">Cleaning</SelectItem>
//                   <SelectItem value="maintenance">Maintenance</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Button variant="outline" size="icon" onClick={() => refetch()}>
//                 <RefreshCcw className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline">
//               <Download className="mr-2 h-4 w-4" />
//               Export
//             </Button>
//             <AddRoomDialog />
//           </div>
//         </CardHeader>
//         <CardContent>
//           <DataTable columns={columns} data={filteredRooms} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Download, Loader2, RefreshCcw } from "lucide-react";
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
import AddRoomDialog from "@/features/rooms/component/AddRoomDialog";
import { columns } from "./columns";

export default function Component() {
  const { data: rooms = [], isLoading, error, refetch } = useGetRooms();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter rooms based on all criteria
  const filteredRooms = rooms.filter((room) => {
    const matchesStatus =
      statusFilter === "all" || room.status === statusFilter;
    const matchesType = typeFilter === "all" || room.type === typeFilter;
    const matchesSearch =
      room.number.toString().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: rooms.length,
    available: rooms.filter((room) => room.status === "available").length,
    occupied: rooms.filter((room) => room.status === "occupied").length,
    cleaning: rooms.filter((room) => room.status === "cleaning").length,
  };

  if (isLoading) {
    return (
      <Card className="min-h-[500px] flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </Card>
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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Rooms" value={stats.total} />
        <StatCard title="Available" value={stats.available} variant="success" />
        <StatCard
          title="Occupied"
          value={stats.occupied}
          variant="destructive"
        />
        <StatCard title="Cleaning" value={stats.cleaning} variant="warning" />
      </div>

      <Card className="bg-transparent border-0">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:flex-1">
              <CardTitle>Rooms</CardTitle>
              <div className="flex flex-1 items-center gap-2 flex-wrap">
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-[250px]"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="kitchenette">Kitchenette</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  className="shrink-0"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="shrink-0">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <AddRoomDialog />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredRooms} />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  variant = "default",
}: {
  title: string;
  value: number;
  variant?: "default" | "success" | "destructive" | "warning";
}) {
  const variantStyles = {
    default: "text-foreground",
    success: "text-green-500",
    destructive: "text-red-500",
    warning: "text-yellow-500",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${variantStyles[variant]}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
