"use client"

import React from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-blue-500 text-white w-full py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-center md:justify-between items-center px-4 text-sm md:text-base">
        <span className="hidden md:flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200">
          <FaPhone className="text-lg" />
          <span>(617) 390 7248</span>
        </span>
        <span className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200">
          <FaEnvelope className="text-lg" />
          <span>Parts@bionicsautoparts.com</span>
        </span>
      </div>
    </header>
  );
};

export default Header;

