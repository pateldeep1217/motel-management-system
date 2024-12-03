"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useCreateBooking } from "@/features/bookings/api/use-create-booking";

import { useGetRooms } from "@/features/rooms/api/use-get-rooms";
import { DatePicker } from "@/components/DatePicker";

const bookingSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  roomId: z.string().min(1, "Room is required"),
  checkInDate: z.date({
    required_error: "Check-in date is required.",
  }),
  checkOutDate: z.date({
    required_error: "Check-out date is required.",
  }),
  totalAmount: z.string(),
  dailyRate: z.string(),
  paymentMethod: z.enum(["Card", "Cash"], {
    required_error: "Please select a payment method.",
  }),
  paidAmount: z.string(),
  idProof: z.string().min(1, "ID proof is required"),
  motelId: z.string().min(1, "Motel ID is required"),
  bookingStatusId: z.string().min(1, "Booking status ID is required"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const { mutate: createBooking, status } = useCreateBooking();
  const { data: rooms, isLoading: isLoadingRooms } = useGetRooms();
  console.log("Raw rooms data:", rooms);
  console.log("isLoadingRooms:", isLoadingRooms);
  const availableRooms =
    rooms?.filter((room) => {
      console.log("Room:", room);
      return room.status === "available";
    }) || [];
  console.log("Filtered availableRooms:", availableRooms);
  const isCreating = status === "pending";

  useEffect(() => {
    console.log("BookingForm mounted or rooms updated");
  }, [rooms]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      roomId: "",
      checkInDate: new Date(),
      checkOutDate: new Date(),
      totalAmount: "",
      dailyRate: "",
      paymentMethod: "Cash",
      paidAmount: "",
      idProof: "",
      motelId: "",
      bookingStatusId: "",
    },
  });

  function onSubmit(data: BookingFormValues) {
    createBooking(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the full name of the guest.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingRooms ? (
                            <SelectItem value="loading" disabled>
                              Loading rooms...
                            </SelectItem>
                          ) : availableRooms.length > 0 ? (
                            availableRooms.map((room) => (
                              <SelectItem key={room.id} value={room.id}>
                                {room.number} - {room.type}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-rooms" disabled>
                              No available rooms
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose an available room.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="checkInDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-in Date</FormLabel>
                      <DatePicker
                        date={field.value}
                        onDateChange={field.onChange}
                      />
                      <FormDescription>
                        Select the check-in date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="checkOutDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-out Date</FormLabel>
                      <DatePicker
                        date={field.value}
                        onDateChange={field.onChange}
                      />
                      <FormDescription>
                        Select the check-out date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the total booking amount.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dailyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the daily rate for the room.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the payment method.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paidAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paid Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the amount already paid.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idProof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Proof</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ID number" />
                      </FormControl>
                      <FormDescription>
                        Enter the guest&apos;s ID proof number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isCreating || isLoadingRooms}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Booking"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
