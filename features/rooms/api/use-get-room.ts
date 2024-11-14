"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetRoom = (id?: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["room", { id }],
    queryFn: async () => {
      const response = await client.api.rooms[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch room");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
