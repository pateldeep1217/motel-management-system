import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";

const useCheckOut = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    InferResponseType<
      (typeof client.api.bookings)["check-out"][":bookingId"]["$post"]
    >,
    Error,
    InferRequestType<
      (typeof client.api.bookings)["check-out"][":bookingId"]["$post"]
    >
  >({
    mutationFn: async (request) => {
      const response = await client.api.bookings["check-out"][":bookingId"][
        "$post"
      ](request);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] }); // Refresh bookings
      queryClient.invalidateQueries({ queryKey: ["rooms"] }); // Refresh room statuses
    },
  });

  return mutation;
};

export default useCheckOut;
