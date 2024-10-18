"use client";
import {
  CogIcon,
  FolderIcon,
  HandHelping,
  HomeIcon,
  MenuIcon,
  X,
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  //slate ,gray, zinc, neutral , stone
  return (
    <div>
      {/* Hamburger Menu */}

      <button
        className="text-white p-2 md:hidden" // Visible on mobile only
        onClick={toggleSidebar}
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out  text-white w-64 h-full z-50`}
      >
        {/* Close Button */}
        <button
          className="text-white p-2 absolute top-4 right-4 md:hidden"
          onClick={toggleSidebar}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-between p-4">
          <span className="text-xl font-bold">Catalyst</span>
        </div>

        {/* Menu Items */}
        <nav className="mt-8">
          <a
            href="#"
            className="flex items-center p-4 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <HomeIcon className="h-6 w-6 mr-3" />
            Home
          </a>
          <a
            href="#"
            className="flex items-center p-4 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <FolderIcon className="h-6 w-6 mr-3" />
            Events
          </a>
          <a
            href="#"
            className="flex items-center p-4 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <CogIcon className="h-6 w-6 mr-3" />
            Settings
          </a>
          <a
            href="#"
            className="flex items-center p-4 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <HandHelping className="h-6 w-6 mr-3" />
            Support
          </a>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full">
          <a
            href="#"
            className="flex items-center p-4 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <HandHelping className="h-6 w-6 mr-3" />
            Support
          </a>
          <a
            href="#"
            className="flex items-center p-4 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <CogIcon className="h-6 w-6 mr-3" />
            Changelog
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
