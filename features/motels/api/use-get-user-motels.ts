"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetUserMotels = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["userMotels", page, limit],
    queryFn: async () => {
      const response = await client.api.motels["user-motels"].$get();
      console.log("URL being called:", client.api.motels["user-motels"].$get);

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch user motels");
      }

      const { userMotelsData } = await response.json();
      return userMotelsData;
    },
  });
};
