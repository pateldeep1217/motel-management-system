"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetRoomStatuses = () => {
  return useQuery({
    queryKey: ["roomStatuses"],
    queryFn: async () => {
      const response = await client.api.rooms.statuses.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
