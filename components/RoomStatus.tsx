"use client";
import { useState } from "react";
import { CheckCircle, AlertCircle, Clock, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type RoomStatus = {
  status: "Clean" | "Dirty" | "Pending";
  count: number;
  details: string[];
};

export default function RoomStatus() {
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | null>(null);

  const roomStatuses: RoomStatus[] = [
    {
      status: "Clean",
      count: 15,
      details: ["5 Standard Rooms", "7 Deluxe Rooms", "3 Suites"],
    },
    {
      status: "Dirty",
      count: 5,
      details: ["2 Standard Rooms", "2 Deluxe Rooms", "1 Suite"],
    },
    {
      status: "Pending",
      count: 2,
      details: ["1 Standard Room", "1 Deluxe Room"],
    },
  ];

  const getStatusIcon = (status: RoomStatus["status"]) => {
    switch (status) {
      case "Clean":
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case "Dirty":
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      case "Pending":
        return <Clock className="w-6 h-6 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: RoomStatus["status"]) => {
    switch (status) {
      case "Clean":
        return "bg-green-400/10 text-green-400";
      case "Dirty":
        return "bg-red-400/10 text-red-400";
      case "Pending":
        return "bg-yellow-400/10 text-yellow-400";
    }
  };

  return (
    <div className="max-w-lg">
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Room Status
        </h2>
      </div>
      <div className="border-1 border-black/15 rounded-lg">
        <div className="flex gap-4">
          {roomStatuses.map((item) => (
            <Dialog key={item.status}>
              <DialogTrigger asChild>
                <div
                  className={`rounded-lg p-4 ${getStatusColor(
                    item.status
                  )} cursor-pointer transition-all duration-200 hover:scale-105`}
                  onClick={() => setSelectedStatus(item)}
                >
                  <div className="flex items-center  mb-2 gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <p className="text-3xl font-bold">{item.count}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{item.status} Rooms Details</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <ul className="list-disc pl-5">
                    {item.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
}
