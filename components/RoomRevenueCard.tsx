import { HandCoinsIcon, Minus, Settings, SettingsIcon } from "lucide-react";

function RoomRevenueCard({ title, revenue, occupied, total }) {
  const occupancyPercentage = (occupied / total) * 100;

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-slate-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="font-medium text-gray-200 mb-2">{title}</p>
          <p className=" mt-3 text-3xl/8 font-semibold sm:text-2xl/8l">
            ${revenue}
          </p>
          <p className="text-sm text-gray-400">Daily Revenue</p>
        </div>
        <HandCoinsIcon className="text-gray-400 w-6 h-6 cursor-pointer" />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className=" text-xl/8 font-semibold sm:text-2xl/8l">
            {occupied}/{total}
          </p>
          <p className="text-sm text-gray-400">Rooms Occupied</p>
        </div>
        <p className="text-xl font-bold text-blue-500">
          {occupancyPercentage.toFixed(0)}%
        </p>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div
          className="bg-sky-500 h-2 rounded-full"
          style={{ width: `${occupancyPercentage}%` }}
        ></div>
      </div>
      <p className="text-right text-sm text-gray-400">Occupancy Rate</p>
    </div>
  );
}

export default RoomRevenueCard;
