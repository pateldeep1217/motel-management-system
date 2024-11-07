import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono"; // Your API client

type ResponseType = InferResponseType<(typeof client.api.rooms)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.rooms)["$post"]>["json"];
export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      try {
        const response = await client.api.rooms.$post({ json });
        console.log(response);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API Error (${response.status}): ${errorData}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Failed to create room:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error) => {
      console.error("Failed to create room:", error.message);
    },
  });
  return mutation;
};
