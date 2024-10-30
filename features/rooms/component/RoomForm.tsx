import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useGetRoomStatuses } from "../api/use-get-room-statuses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roomSchema = z.object({
  roomNumber: z.string(),
  type: z.string(),
  price: z.number().positive("Price must be a positive number"),
  status: z.string(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

type RoomFormProps = {
  id?: string;
  defaultValues?: RoomFormValues;

  disabled?: boolean;
};

const RoomForm = ({
  id,
  defaultValues,

  disabled,
}: RoomFormProps) => {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues,
  });

  const { data: statuses = [] } = useGetRoomStatuses();
  const handleSubmit = (values: RoomFormValues) => {};

  const handleDelete = () => {};

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="roomNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Number</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="e.g., 101" {...field} />
              </FormControl>
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
                  type="number"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
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
                      <SelectItem key={status.id} value={status.id}>
                        {status.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create room"}
        </Button>

        {id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="size-4 mr-2" /> Delete room
          </Button>
        )}
      </form>
    </Form>
  );
};

export default RoomForm;
