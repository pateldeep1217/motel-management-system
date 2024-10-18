import DashboardOverview from "@/features/auth/components/DashboardOverview";
import DailyRoomRevenue from "./DailyRoomRevenue";
import { protectServer } from "@/features/auth/utils";

export default async function Home() {
  await protectServer();
  return (
    <div className="mx-auto max-w-7xl">
      <DashboardOverview />
      <DailyRoomRevenue />
    </div>
  );
}
