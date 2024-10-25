import DashboardOverview from "@/features/auth/components/DashboardOverview";
import DailyRoomRevenue from "../../components/DailyRoomRevenue";

import RoomStatus from "../../components/RoomStatus";
import UserMotelsList from "@/features/motels/components/UserMotelsList";

export default async function Home() {
  return (
    <div className="mx-auto max-w-7xl">
      <DashboardOverview />
      <DailyRoomRevenue />
      <RoomStatus />
      <UserMotelsList />
    </div>
  );
}
