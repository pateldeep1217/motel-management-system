import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, previous }) => {
  const difference = parseInt(value) - parseInt(previous);
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-slate-800   ">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className=" font-medium mb-2">{title}</p>
          <p className=" mt-3 text-3xl/8 font-semibold sm:text-2xl/8l">
            {value}
          </p>
        </div>
        <Icon className="text-gray-400 w-6 h-6" />
      </div>

      <div className="flex items-center gap-2 text-sm">
        {isIncrease ? (
          <>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500">+{difference} increase</span>
          </>
        ) : isDecrease ? (
          <>
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
            <span className="text-rose-500">{difference} decrease</span>
          </>
        ) : (
          <>
            <Minus className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500">No change</span>
          </>
        )}
        <span className="text-gray-500 ml-auto">from {previous} yesterday</span>
      </div>
    </div>
  );
};

export default StatCard;
