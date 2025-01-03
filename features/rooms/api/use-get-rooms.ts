"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await client.api.rooms.$get({
        query: {
          page: "1",
          limit: "10",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
