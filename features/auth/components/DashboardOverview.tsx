import StatCard from "@/app/(dashboard)/StatCard";
import {
  UserPlus,
  DoorClosed,
  Building2,
  DoorOpen,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

const DashboardOverview = () => {
  const stats = [
    {
      title: "Today's Check-ins",
      value: 5, // Current day's check-ins
      previous: 3, // Yesterday's check-ins
      icon: UserPlus,
    },
    {
      title: "Total Rooms",
      value: 22, // Total rooms in the motel
      previous: 22, // No change
      icon: Building2,
    },
    {
      title: "Occupied Rooms",
      value: 20, // Currently occupied rooms
      previous: 18, // Rooms occupied yesterday
      icon: DoorClosed,
    },
    {
      title: "Available Rooms",
      value: 2, // Current available rooms
      previous: 4, // Available rooms yesterday
      icon: DoorOpen,
    },
  ];

  return (
    <div className=" space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Overview</h2>
        <p className="text-gray-400 text-sm">Real-time hotel metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};
export default DashboardOverview;
