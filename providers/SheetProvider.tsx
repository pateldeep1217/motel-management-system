"use client";

import { EditRoomSheet } from "@/features/rooms/component/EditRoomSheet";
import NewRoomSheet from "@/features/rooms/component/NewRoomSheet";
import React, { useEffect, useState } from "react";

function SheetProvider() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <>
      <NewRoomSheet />
      <EditRoomSheet />
    </>
  );
}

export default SheetProvider;
