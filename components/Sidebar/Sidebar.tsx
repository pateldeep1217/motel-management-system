"use client";
import React, { Fragment, useState } from "react";
import Logo from "../svg/Logo";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { MenuIcon, XIcon } from "lucide-react";
import SidebarContent from "./SidebarContent";
import UserButton from "@/features/auth/components/UserButton";

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden flex justify-between items-center w-full p-4  ">
        <button
          className=""
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <MenuIcon size={24} className="text-white" />
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex lg:w-64  h-full fixed  ">
        <SidebarContent />
      </div>
      {/* MOBILE SIDEBAR */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <TransitionChild
            as={Fragment}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-opacity-50 bg-black" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transition ease-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in duration-200 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative w-64 text-white h-full shadow-xl bg-background overflow-y-auto">
                <XIcon
                  size={20}
                  className="absolute top-4 right-4 cursor-pointer"
                  onClick={() => setSidebarOpen(false)}
                />
                <SidebarContent />
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default Sidebar;
