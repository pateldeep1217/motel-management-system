"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetBooking = (id?: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["booking", { id }],
    queryFn: async () => {
      const response = await client.api.bookings[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch booking");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
