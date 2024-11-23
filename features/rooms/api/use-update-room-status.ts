"use client";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.rooms.updatestatus)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.rooms.updatestatus)[":id"]["$patch"]
>["json"];

export const useUpdateRoomStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType & { id: string }
  >({
    mutationFn: async ({ id, status }) => {
      const response = await client.api.rooms.updatestatus[":id"]["$patch"]({
        param: { id },
        json: { status },
      });

      if (!response.ok) {
        throw new Error("Failed to update room status");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Room status updated");

      queryClient.invalidateQueries({ queryKey: ["room"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update room status");
    },
  });

  return mutation;
};
