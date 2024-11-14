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

export const useEditBooking = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.bookings[":id"]["$patch"]({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Booking updated");

      queryClient.invalidateQueries({ queryKey: ["booking", { id }] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: () => {
      toast.error("Failed to update booking");
    },
  });

  return mutation;
};
