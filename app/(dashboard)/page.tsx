"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  CalendarCheck,
  CalendarClock,
  Wallet,
  TrendingUp,
  BadgePercent,
  Calendar,
} from "lucide-react";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";

export default function Home() {
  const sessionUseSession = useSession();

  return (
    <div>
      <p>{sessionUseSession.data?.user?.name}</p>
    </div>
  );
}
