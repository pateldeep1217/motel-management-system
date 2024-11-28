import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  roomId: z.string().min(1, "Room selection is required"),
  checkInDate: z.date({
    required_error: "Check-in date is required",
  }),
  checkOutDate: z.date({
    required_error: "Check-out date is required",
  }),
  dailyRate: z.number().positive("Daily rate must be positive"),
  idProof: z.string().min(1, "ID proof is required"),
  paidAmount: z.number().nonnegative("Paid amount must be non-negative"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

interface CheckInFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  availableRooms: { id: string; number: string }[];
  isSubmitting: boolean;
}

const CheckInFormModal: React.FC<CheckInFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableRooms,
  isSubmitting,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: "",
      roomId: "",
      checkInDate: new Date(),
      checkOutDate: new Date(),
      dailyRate: 0,
      idProof: "",
      paidAmount: 0,
      phoneNumber: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const nights = Math.ceil(
      (data.checkOutDate.getTime() - data.checkInDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const totalAmount = nights * data.dailyRate;
    const pendingAmount = totalAmount - data.paidAmount;
    onSubmit({
      ...data,
      totalAmount,
      pendingAmount,
      paymentDueDate: data.checkInDate, // Set payment due date to check-in date
    });
    form.reset();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check-in Form</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter guest name" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Room" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkInDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-in Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="ghost">
                          {field.value
                            ? format(field.value, "MM/dd/yyyy")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOutDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-out Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="ghost">
                          {field.value
                            ? format(field.value, "MM/dd/yyyy")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
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
                      placeholder="Enter daily rate"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
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
                    <Input placeholder="Enter ID proof number" {...field} />
                  </FormControl>
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
                      placeholder="Enter paid amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
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
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInFormModal;
