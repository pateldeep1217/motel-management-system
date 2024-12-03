import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono"; // Your API client
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.bookings)["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.bookings)["$post"]
>["json"];

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.bookings.$post({ json });

      if (!response.ok) {
        console.error(
          `Error creating booking: ${response.status} ${response.statusText}`
        );

        throw new Error("Invalid JSON response");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking created successfully");
    },
    onError: (error) => {
      console.error("Failed to create booking:", error.message);
      toast.error("Failed to create booking");
    },
  });
  return mutation;
};
