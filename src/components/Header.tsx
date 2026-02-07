"use client";

import { useState } from "react";
import { NAV_ITEMS } from "@/data/projects";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <a href="/" className="logo">
        Studio
      </a>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-sm text-white/60 hover:text-white transition-colors tracking-wide"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Hamburger (mobile) */}
      <button
        className="relative md:hidden flex flex-col justify-center gap-[5px] w-7 h-7 bg-transparent border-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-full h-[2px] rounded-sm bg-white/80 transition-all duration-300 origin-center ${
            menuOpen ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`block w-full h-[2px] rounded-sm bg-white/80 transition-all duration-300 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-full h-[2px] rounded-sm bg-white/80 transition-all duration-300 origin-center ${
            menuOpen ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="absolute top-full right-4 mt-2 min-w-[180px] rounded-xl bg-[#141414]/95 backdrop-blur-xl border border-white/10 py-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-6 py-3.5 text-[15px] text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
