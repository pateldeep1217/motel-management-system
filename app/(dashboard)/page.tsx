import DashboardOverview from "@/features/auth/components/DashboardOverview";
import DailyRoomRevenue from "../../components/DailyRoomRevenue";

import RoomStatus from "../../components/RoomStatus";

export default async function Home() {
  return (
    <div className="mx-auto max-w-7xl">
      <DashboardOverview />
      <DailyRoomRevenue />
      <RoomStatus />
    </div>
  );
}
