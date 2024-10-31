"use client";

import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRoomStatuses } from "../api/use-get-room-statuses";

const roomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  type: z.string().min(1, "Room type is required"),
  price: z.number().positive("Price must be a positive number"),
  status: z.string().min(1, "Status is required"),
});

type RoomFormValues = z.infer<typeof roomSchema>;

type RoomFormProps = {
  id?: string;
  defaultValues?: RoomFormValues;
  disabled?: boolean;
  onSubmit: (values: RoomFormValues) => void;
  onDelete?: () => void;
};

export default function RoomForm({
  id,
  defaultValues,
  disabled,
  onSubmit,
  onDelete,
}: RoomFormProps) {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: defaultValues || {
      roomNumber: "",
      type: "",
      price: 0,
      status: "",
    },
  });

  const { data: statuses = [] } = useGetRoomStatuses();

  return (
    <div className="lg:p-14 lg:pt-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="roomNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabled}
                      placeholder="e.g., 101"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabled}
                      placeholder="e.g., Single, Double"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabled}
                      placeholder="e.g., 100"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    disabled={disabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.id} value={status.status}>
                          {status.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="gap-4 sm:gap-0">
            {id && (
              <Button
                type="button"
                disabled={disabled}
                onClick={onDelete}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                <Trash className="mr-2 size-4" />
                Delete room
              </Button>
            )}
            <Button
              type="submit"
              disabled={disabled}
              className="w-full sm:w-auto"
            >
              {id ? "Save changes" : "Create room"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
