"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await client.api.bookings.$get({
        query: {
          page: "1",
          limit: "10",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
