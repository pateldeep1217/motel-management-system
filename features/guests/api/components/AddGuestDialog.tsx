import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import RoomForm from "./RoomForm";
import { Plus } from "lucide-react";
import GuestForm from "./GuestForm";

export const AddGuestDialog = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    // Handle room data submission here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          New Guest
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[40rem]">
        <DialogHeader>
          <DialogTitle className="m-auto lg:pt-14">Add Guest</DialogTitle>
          <DialogDescription className="m-auto ">
            Fill in the details to add a new guest.
          </DialogDescription>
        </DialogHeader>
        <GuestForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestDialog;
