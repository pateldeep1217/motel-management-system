import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.rooms)[":id"]["$delete"]
>;

export const useDeleteRoom = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Room ID is required for deletion");
      }
      const response = await client.api.rooms[":id"]["$delete"]({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("Failed to delete room");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Room deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["room", { id }] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["userMotel"] });
    },
    onError: () => {
      toast.error("Failed to delete room");
    },
  });

  return mutation;
};
