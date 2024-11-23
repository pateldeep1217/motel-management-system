import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.bookings)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.bookings)[":id"]["$patch"]
>["json"];

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    { id: string; statusId: string }
  >({
    mutationFn: async ({ id, statusId }) => {
      const response = await client.api.bookings[":id"]["$patch"]({
        param: { id },
        json: { bookingStatusId: statusId } as RequestType,
      });
      return await response.json();
    },
    onSuccess: (_, variables) => {
      toast.success("Booking status updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["booking", { id: variables.id }],
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      toast.error(`Failed to update booking status: ${error.message}`);
    },
  });

  return mutation;
};
