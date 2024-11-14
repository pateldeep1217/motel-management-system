import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.bookings)[":id"]["$delete"]
>;

export const useDeleteBooking = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Booking ID is required for deletion");
      }
      const response = await client.api.bookings[":id"]["$delete"]({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Booking deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["booking", { id }] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: () => {
      toast.error("Failed to delete booking");
    },
  });

  return mutation;
};
