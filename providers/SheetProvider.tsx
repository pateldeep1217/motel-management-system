"use client";

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
    </>
  );
}

export default SheetProvider;
