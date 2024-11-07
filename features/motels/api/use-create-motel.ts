import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono"; // Your API client
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.motels)["create"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.motels)["create"]["$post"]
>["json"];

export const useCreateMotel = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.motels.create.$post({ json });
      console.log(response);

      if (!response.ok) {
        throw new Error("Invalid JSON response");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userMotels"] });

      router.push("/");
    },
    onError: (error) => {
      console.error("Failed to create motel:", error.message);
    },
  });
  return mutation; // Return the mutation object
};
