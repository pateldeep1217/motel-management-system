"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetBookingStatuses = () => {
  return useQuery({
    queryKey: ["bookingStatuses"],
    queryFn: async () => {
      const response = await client.api.bookings.statuses.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch booking statuses");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
