"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetUserMotels = () => {
  return useQuery({
    queryKey: ["userMotels"],
    queryFn: async () => {
      const response = await client.api.motels.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch user motels");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
