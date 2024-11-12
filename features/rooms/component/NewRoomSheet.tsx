"use client";

import { useNewRoom } from "@/features/rooms/hooks/useNewRoom";
// import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RoomForm } from "./RoomForm";
import { useCreateRoom } from "../api/use-create-room";
import { roomInsertSchema } from "@/db/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = roomInsertSchema.pick({
  number: true,
  statusId: true,
  price: true,
  capacity: true,
  type: true,
});

type FormValues = z.infer<typeof formSchema>;

function NewRoomSheet() {
  const { isOpen, onClose } = useNewRoom();
  const mutation = useCreateRoom();
  const { toast } = useToast();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Room Added",
          description: "Successfully added a new room.",
          duration: 5000,
          className: "bg-green-500 text-white p-4 rounded-lg shadow-lg",
        });
        onClose();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to add the room.",
          duration: 5000,
          className: "bg-red-500 text-white p-4 rounded-lg shadow-lg",
        });
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Room</SheetTitle>
          <SheetDescription>
            Fill in the details to add a new room to your motel.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <RoomForm
            onSubmit={onSubmit}
            disabled={false}
            defaultValues={{
              number: "",
              price: "",
              statusId: "",
              capacity: 2,
              type: "",
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NewRoomSheet;
