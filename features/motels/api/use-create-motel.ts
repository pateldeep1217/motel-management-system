import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono"; // Your API client
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<(typeof client.api.motels)["$post"], 200>;
type RequestType = InferRequestType<
  (typeof client.api.motels)["$post"]
>["json"];

export const useCreateMotel = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (motelData) => {
      const response = await client.api.motels.create.$post({
        json: motelData,
      });

      if (response.ok) {
        const data = await response.json();
        return data; // Return the new motel data
      } else {
        throw new Error("Failed to create motel");
      }
    },
    onSuccess: () => {
      // Invalidate the query with the same key used in useGetUserMotels
      queryClient.invalidateQueries({ queryKey: ["userMotels"] }); // Ensure the same key structure
      router.push("/"); // Redirect after mutation
    },
    onError: (error) => {
      console.error("Failed to create motel:", error.message);
    },
  });

  return mutation; // Return the mutation object
};
