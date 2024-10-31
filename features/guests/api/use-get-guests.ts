"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetGuests = () => {
  return useQuery({
    queryKey: ["guest"],
    queryFn: async () => {
      const response = await client.api.guests.$get({
        query: {
          page: "1",
          limit: "10",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch guests");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
