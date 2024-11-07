"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import CreateRoomForm from "./CreateRoomForm";

export function RoomSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline">Add New Room</Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Add New Room</SheetTitle>
            <SheetDescription>
              Fill in the details to add a new room to your motel.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <CreateRoomForm onSuccess={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      <Toaster />
    </>
  );
}
