"use client";

import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";
import { roomInsertSchema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOpenRoom } from "../hooks/useOpenRoom";
import { useGetRoom } from "../api/use-get-room";
import { useEditRoom } from "../api/use-edit-room";
import { useDeleteRoom } from "../api/use-delete-room";
import { RoomForm } from "./RoomForm";
import { useGetRoomStatuses } from "../api/use-get-room-statuses";

const formSchema = roomInsertSchema.pick({
  number: true,
  statusId: true,
  price: true,
  capacity: true,
  type: true,
});

type FormValues = z.infer<typeof formSchema>;

export const EditRoomSheet = () => {
  const { isOpen, onClose, id } = useOpenRoom();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this room."
  );

  const roomQuery = useGetRoom(id);
  const editMutation = useEditRoom(id);
  const deleteMutation = useDeleteRoom(id);
  const { data: roomStatuses = [] } = useGetRoomStatuses();

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = roomQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = roomQuery.data
    ? {
        number: roomQuery.data.number,
        statusId: roomStatuses?.find(
          (s) => s.status.toLowerCase() === roomQuery.data.status.toLowerCase()
        )?.id, // Map status to statusId
        price: roomQuery.data.price,
        capacity: roomQuery.data.capacity,
        type: roomQuery.data.type,
      }
    : {
        number: "",
        status: "",
        price: "",
        capacity: 2,
        type: "",
      };
  console.log("defaultValues in EditRoomSheet:", defaultValues); // Log default values

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Room</SheetTitle>
            <SheetDescription>Edit an existing room</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <RoomForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
