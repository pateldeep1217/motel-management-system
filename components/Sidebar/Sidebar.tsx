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

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <button
        className="lg:hidden m-4"
        onClick={() => setSidebarOpen(true)} // Open the sidebar
        aria-label="Open sidebar"
      >
        <MenuIcon size={24} className="text-white" />
      </button>
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
            <div className="fixed inset-0 bg-black bg-opacity-50" />
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
              <DialogPanel className="relative w-64 bg-neutral-900  text-white h-full shadow-xl">
                {/* Close icon */}
                <XIcon
                  size={20}
                  className="m-4 cursor-pointer"
                  onClick={() => setSidebarOpen(false)}
                />
                {/* Sidebar content */}
                <SidebarContent />
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
      <div className="hidden lg:block lg:w-64 h-full bg-[#0a0a0a]">
        <SidebarContent />
      </div>
    </div>
  );
}

export default Sidebar;
