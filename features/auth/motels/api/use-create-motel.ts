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

      console.log("Full response:", response); // Log the full response

      // If the response is successful, parse the JSON body
      if (response.ok) {
        try {
          const data = await response.json();
          return data; // Ensure this matches the expected response
        } catch (error) {
          console.error("Error parsing JSON:", error);
          throw new Error("Invalid JSON response");
        }
      } else {
        throw new Error("Failed to create motel");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["motels"] });
      console.log("Router object:", router);

      router.push("/");
    },
    onError: (error) => {
      console.error("Failed to create motel:", error.message);
    },
  });

  return mutation; // Return the mutation object
};
