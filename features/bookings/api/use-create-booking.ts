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
      // Convert dates to ISO strings before sending the request
      const payload = {
        ...json,
        checkInDate: new Date(json.checkInDate).toISOString(),
        checkOutDate: new Date(json.checkOutDate).toISOString(),
      };

      const response = await client.api.bookings.$post({ json: payload });

      if (!response.ok) {
        console.error(
          `Error creating booking: ${response.status} ${response.statusText}`
        );
        console.error(await response.text());
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
