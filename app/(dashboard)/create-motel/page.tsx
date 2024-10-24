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
import { useCreateMotel } from "@/features/auth/motels/api/use-create-motel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Create the schema for motel form
const motelSchema = z.object({
  name: z.string().min(2, "Motel name must be at least 2 characters"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phoneNumber: z.string(),
  description: z.string().optional(),
});

type MotelFormValues = z.infer<typeof motelSchema>;
export default function CreateMotel() {
  // Define form using useForm hook
  const form = useForm<MotelFormValues>({
    resolver: zodResolver(motelSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      description: "",
    },
  });
  const { mutate, isLoading, isSuccess, isError } = useCreateMotel();

  const handleSubmit = (data: any) => {
    mutate(data); // Sends form data via the mutation hook
    console.log(data);
  };

  return (
    <div className="flex overflow-hidden justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-[40rem]">
          <h1 className="text-2xl font-bold mb-4">Create a New Motel</h1>
          <fieldset
            disabled={form.formState.isSubmitting}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Paradise Inn" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main Street"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Lansing" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="MI" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="90001" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(555) 555-5555"
                        type="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A brief description of your motel"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <Button type="submit" className="w-full mt-5" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Motel"}
          </Button>
          {isSuccess && <p>Motel created successfully!</p>}
          {isError && <p>Failed to create motel</p>}
        </form>
      </Form>
    </div>
  );
}
