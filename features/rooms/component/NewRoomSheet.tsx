"use client";

import { useNewRoom } from "@/features/rooms/hooks/useNewRoom";
// import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
// import { Toaster } from "@/components/ui/toaster";

function NewRoomSheet() {
  const { isOpen, onClose } = useNewRoom();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        {/* <SheetTrigger asChild>
          <Button variant="outline">Add New Room</Button>
        </SheetTrigger> */}
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Add New Room</SheetTitle>
            <SheetDescription>
              Fill in the details to add a new room to your motel.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6"></div>
        </SheetContent>
      </Sheet>
      {/* <Toaster /> */}
    </>
  );
}

export default NewRoomSheet;
