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

export const AddRoomDialog = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    // Handle room data submission here
    console.log("Room Data:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Add New Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Room</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new room.
          </DialogDescription>
        </DialogHeader>
        <RoomForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomDialog;
