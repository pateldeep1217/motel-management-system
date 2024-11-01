"use client";

import { z } from "zod";
import { Trash, XCircle, CheckCircle } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

const guestSchema = z.object({
  name: z.string().min(1, "Guest name is required"),
  phone: z.string().min(1, "Phone number is required"),
  idProof: z.string().min(1, "Identity number is required"),
  doNotRent: z.boolean().default(false),
});

type GuestFormValues = z.infer<typeof guestSchema>;

type GuestFormProps = {
  id?: string;
  defaultValues?: GuestFormValues;
  disabled?: boolean;
  onSubmit: (values: GuestFormValues) => void;
  onDelete?: () => void;
};

export default function GuestForm({
  id,
  defaultValues,
  disabled,
  onSubmit,
  onDelete,
}: GuestFormProps) {
  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: defaultValues || {
      name: "",
      phone: "",
      idProof: "",
      doNotRent: false,
    },
  });

  return (
    <div className="lg:p-14 lg:pt-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabled}
                      placeholder="e.g., John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabled}
                      placeholder="e.g., +1 123-456-7890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="idProof"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identity Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabled}
                      placeholder="e.g., DL12345678"
                      {...field}
                    />
                  </FormControl>
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
                Delete guest
              </Button>
            )}
            <Button
              type="submit"
              disabled={disabled}
              className="w-full sm:w-auto"
            >
              {id ? "Save changes" : "Add guest"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
