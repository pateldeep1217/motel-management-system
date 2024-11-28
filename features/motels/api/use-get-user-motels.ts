"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetUserMotels = () => {
  return useQuery({
    queryKey: ["userMotels"],
    queryFn: async () => {
      try {
        const response = await client.api.motels.$get();

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error fetching motels:", {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
          });
          throw new Error(`Failed to fetch motels: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error("Error in useGetUserMotels:", {});
        throw error;
      }
    },
    retry: false, // Disable retries for debugging
    refetchOnWindowFocus: false, // Disable window focus refetch for debugging
  });
};
