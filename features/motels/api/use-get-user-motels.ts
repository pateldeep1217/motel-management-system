"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetUserMotels = () => {
  return useQuery({
    queryKey: ["userMotels"], // Removed pagination parameters
    queryFn: async () => {
      const response = await client.api.motels["user-motels"].$get();
      console.log("URL being called:", client.api.motels["user-motels"].$get);

      if (!response.ok) {
        throw new Error("Failed to fetch user motels");
      }

      const { userMotelsData } = await response.json();
      return userMotelsData; // Return the data correctly
    },
  });
};
