"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetRoomStatuses = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await client.api.rooms.status.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
