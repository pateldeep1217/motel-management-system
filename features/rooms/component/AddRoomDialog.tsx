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
import { useCreateRoom } from "../api/use-create-room";
import { useRouter } from "next/navigation";
import CreateRoomForm from "./CreateRoomForm";

export default function AddRoomDialog() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const DialogComponent = isMobile ? Sheet : Dialog;
  const DialogContentComponent = isMobile ? SheetContent : DialogContent;
  const DialogHeaderComponent = isMobile ? SheetHeader : DialogHeader;
  const DialogTitleComponent = isMobile ? SheetTitle : DialogTitle;
  const DialogDescriptionComponent = isMobile
    ? SheetDescription
    : DialogDescription;
  const DialogTriggerComponent = isMobile ? SheetTrigger : DialogTrigger;

  return (
    <DialogComponent>
      <DialogTriggerComponent asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Room
        </Button>
      </DialogTriggerComponent>
      <DialogContentComponent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeaderComponent className="py-6">
          <DialogTitleComponent className="text-center text-xl">
            Add Room
          </DialogTitleComponent>
          <DialogDescriptionComponent className="text-center">
            Fill in the details to add a new room.
          </DialogDescriptionComponent>
        </DialogHeaderComponent>
        <div className="space-y-6 px-2">
          <CreateRoomForm
            onSubmit={(data) => {
              router.push("/rooms");
            }}
          />
        </div>
      </DialogContentComponent>
    </DialogComponent>
  );
}
export default AddRoomDialog;
