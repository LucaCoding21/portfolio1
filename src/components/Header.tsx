"use client";

import { useState, useEffect } from "react";
import { NAV_ITEMS } from "@/data/projects";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 md:px-10 transition-all duration-500 ${scrolled ? "bg-white/70 backdrop-blur-xl border-b border-black/[0.06] shadow-sm" : ""}`}>
      <a href="/" className={`logo ${scrolled ? "!text-black/80" : "!text-white/80"} transition-colors duration-500`}>
        Studio
      </a>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`relative text-sm transition-colors duration-500 tracking-wide after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:transition-all after:duration-300 hover:after:w-full ${
              scrolled
                ? "text-black/60 hover:text-black after:bg-black"
                : "text-white/75 hover:text-white after:bg-white"
            }`}
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
          className={`block w-full h-[2px] rounded-sm transition-all duration-300 origin-center ${
            scrolled ? "bg-black/80" : "bg-white/80"
          } ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
        />
        <span
          className={`block w-full h-[2px] rounded-sm transition-all duration-300 ${
            scrolled ? "bg-black/80" : "bg-white/80"
          } ${menuOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`block w-full h-[2px] rounded-sm transition-all duration-300 origin-center ${
            scrolled ? "bg-black/80" : "bg-white/80"
          } ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
        />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="absolute top-full right-4 mt-2 min-w-[180px] rounded-xl bg-white/95 backdrop-blur-xl border border-black/10 py-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-6 py-3.5 text-[15px] text-black/80 hover:text-black hover:bg-black/5 transition-colors"
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
