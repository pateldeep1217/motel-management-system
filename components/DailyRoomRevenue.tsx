import RoomRevenueCard from "./RoomRevenueCard";

function DailyRoomRevenue() {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-200 mb-4">Room Revenue</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RoomRevenueCard
          title="Single Rooms"
          revenue={500}
          occupied={8}
          total={10}
        />
        <RoomRevenueCard
          title="Double Rooms"
          revenue={800}
          occupied={7}
          total={8}
        />
        <RoomRevenueCard
          title="Kitchenette Rooms"
          revenue={1200}
          occupied={5}
          total={6}
        />
      </div>
    </div>
  );
}

export default DailyRoomRevenue;
