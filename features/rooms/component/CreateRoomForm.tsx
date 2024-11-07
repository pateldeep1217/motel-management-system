"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateRoom } from "@/features/rooms/api/use-create-room";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const roomSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  type: z.string().min(1, "Room type is required"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  price: z.string().min(1, "Price is required"),
  statusId: z.string().min(1, "Status is required"),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface CreateRoomFormProps {
  onSuccess?: () => void;
}

export default function CreateRoomForm({ onSuccess }: CreateRoomFormProps) {
  const { toast } = useToast();
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      number: "",
      type: "",
      capacity: 1,
      price: "",
      statusId: "",
    },
  });

  const { mutate, isLoading } = useCreateRoom();

  const handleSubmit = (data: RoomFormValues) => {
    console.log("Form data:", data);
    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Room created successfully!",
          variant: "default",
          className: "bg-green-500 text-white",
        });

        form.reset();
        onSuccess?.();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to create room. Please try again.",
          variant: "destructive",
        });
        console.error("Failed to create room:", error);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Number</FormLabel>
              <FormControl>
                <Input placeholder="101" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  placeholder="2"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="100.00" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="statusId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Room"}
        </Button>
      </form>
    </Form>
  );
}
