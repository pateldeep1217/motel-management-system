import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.rooms)[":id"]["$delete"]
>;

export const useDeleteRoom = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      if (id === undefined) {
        throw new Error("id is required");
      }
      const response = await client.api.rooms[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Room deleted");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["userMotels"] });
    },
    onError: () => {
      toast.error("Failed to delete room");
    },
  });

  return mutation;
};
