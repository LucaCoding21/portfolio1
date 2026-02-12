"use client";

import { useState, useEffect, useRef } from "react";
import { NAV_ITEMS } from "@/data/projects";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 50);

      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
        setMenuOpen(false);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed left-0 right-0 z-50 flex justify-center px-4 py-4 transition-all duration-300 ${hidden ? "-top-24" : "top-0"}`}>
      <div
        className={`relative z-50 flex items-center justify-between w-full max-w-5xl px-8 py-4 rounded-full transition-all duration-500 ${
          menuOpen
            ? "bg-transparent border border-transparent"
            : scrolled
              ? "bg-white/70 backdrop-blur-xl border border-black/[0.08] shadow-lg shadow-black/[0.03]"
              : "bg-white/10 backdrop-blur-md border border-white/20"
        }`}
      >
        {/* Logo */}
        <a
          href="/"
          className={`font-[family-name:var(--font-outfit)] font-semibold text-2xl tracking-tight transition-colors duration-500 ${
            menuOpen ? "text-black/90" : scrolled ? "text-black/90" : "text-white"
          }`}
        >
          cloverstudio
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`px-4 py-2 rounded-full text-base font-[family-name:var(--font-outfit)] font-medium transition-all duration-300 ${
                scrolled
                  ? "text-black/70 hover:text-black hover:bg-[#CDFF50]"
                  : "text-white/80 hover:text-black hover:bg-[#CDFF50]"
              }`}
            >
              {item.label}
            </a>
          ))}

          {/* CTA Button */}
          <a
            href="#contact"
            className={`ml-2 px-6 py-2.5 rounded-full text-base font-[family-name:var(--font-outfit)] font-medium transition-all duration-300 ${
              scrolled
                ? "bg-black text-white hover:bg-[#CDFF50] hover:text-black"
                : "bg-white text-black hover:bg-[#CDFF50]"
            }`}
          >
            Get Started
          </a>
        </nav>

        {/* Hamburger (mobile) */}
        <button
          className="relative z-50 md:hidden flex flex-col justify-center gap-[5px] w-7 h-7 bg-transparent border-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-full h-[2px] rounded-sm transition-all duration-300 origin-center ${
              menuOpen ? "bg-black" : scrolled ? "bg-black/80" : "bg-white/80"
            } ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block w-full h-[2px] rounded-sm transition-all duration-300 ${
              menuOpen ? "bg-black" : scrolled ? "bg-black/80" : "bg-white/80"
            } ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-full h-[2px] rounded-sm transition-all duration-300 origin-center ${
              menuOpen ? "bg-black" : scrolled ? "bg-black/80" : "bg-white/80"
            } ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Full-page mobile menu */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
