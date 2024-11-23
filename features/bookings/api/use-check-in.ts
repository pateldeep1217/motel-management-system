import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";

const useCheckIn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    InferResponseType<
      (typeof client.api.bookings)["check-in"][":bookingId"]["$post"]
    >,
    Error,
    InferRequestType<
      (typeof client.api.bookings)["check-in"][":bookingId"]["$post"]
    >
  >({
    mutationFn: async (request) => {
      const response = await client.api.bookings["check-in"][":bookingId"][
        "$post"
      ](request);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  return mutation;
};

export default useCheckIn;
