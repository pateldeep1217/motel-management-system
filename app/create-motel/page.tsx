"use client";

import Logo from "@/components/svg/Logo";
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
import { useCreateMotel } from "@/features/motels/api/use-create-motel";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full p-4 pt-20">
        <Link
          href="/"
          className="block w-fit mx-auto"
          aria-label="Back to Dashboard"
        >
          <Logo className="h-8 w-auto" />
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-8 px-4">
        <div className="max-w-[40rem] mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <h1 className="text-2xl font-bold mb-6">Create a New Motel</h1>
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
                        <Input
                          placeholder="Paradise Inn"
                          type="text"
                          {...field}
                        />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Motel"}
              </Button>
              {isSuccess && (
                <p className="mt-4 text-center text-green-500">
                  Motel created successfully!
                </p>
              )}
              {isError && (
                <p className="mt-4 text-center text-red-500">
                  Failed to create motel
                </p>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
