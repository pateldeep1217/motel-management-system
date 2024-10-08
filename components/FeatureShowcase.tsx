import React from "react";
import FeatureCard from "./FeatureCard";
import { BarChart, ClipboardCheck, Clock, DollarSign } from "lucide-react";

function FeatureShowcase() {
  return (
    <div className="h-full bg-sky-950 hidden lg:flex flex-col items-center justify-center text-white p-8">
      <h2 className="text-3xl font-bold mb-8">
        Modernize Your Motel Management
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <FeatureCard
          icon={<ClipboardCheck className="h-8 w-8" />}
          title="Digital Bookings"
          description="Replace paper ledgers with efficient digital booking management"
        />
        <FeatureCard
          icon={<Clock className="h-8 w-8" />}
          title="Save Time"
          description="Automate routine tasks and focus on guest experience"
        />
        <FeatureCard
          icon={<DollarSign className="h-8 w-8" />}
          title="Increase Revenue"
          description="Optimize pricing and occupancy with data-driven insights"
        />
        <FeatureCard
          icon={<BarChart className="h-8 w-8" />}
          title="Better Insights"
          description="Get detailed reports and analytics for informed decisions"
        />
      </div>
    </div>
  );
}

export default FeatureShowcase;
