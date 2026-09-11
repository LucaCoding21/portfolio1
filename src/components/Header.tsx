"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data/projects";
import MobileMenu from "./MobileMenu";
import AudioToggle from "./AudioToggle";

export default function Header({ solid }: { solid?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  // Homepage stays transparent over its dark hero; every other route is solid.
  // Explicit `solid` prop still wins if a page wants to override.
  const isHome = pathname === "/";
  const effectiveSolid = solid ?? !isHome;
  const isScrolled = effectiveSolid || scrolled;

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

  // Reset transient state when route changes — prevents a hidden/scrolled header
  // on the previous page from carrying over. (The first scroll event after this
  // will repopulate lastScrollY, so no need to touch the ref here.)
  const [trackedPath, setTrackedPath] = useState(pathname);
  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    setHidden(false);
    setScrolled(false);
    setMenuOpen(false);
  }

  return (
    <header className={`fixed left-0 right-0 z-50 flex justify-center px-4 py-4 transition-all duration-300 ${hidden ? "-top-24" : "top-0"}`}>
      <div
        className={`relative z-50 flex items-center justify-between w-full max-w-5xl px-8 py-4 rounded-2xl transition-all duration-500 ${
          menuOpen
            ? "bg-transparent border border-transparent"
            : isScrolled
              ? "bg-[rgba(10,10,12,0.38)] backdrop-blur-xl backdrop-saturate-[1.8] backdrop-brightness-[0.84] border border-white/[0.10] shadow-[0_6px_20px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "bg-[rgba(10,10,12,0.28)] backdrop-blur-xl backdrop-saturate-[1.7] backdrop-brightness-[0.82] border border-white/[0.14] shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.10)]"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`font-[family-name:var(--font-outfit)] font-semibold text-2xl tracking-tight transition-colors duration-500 ${
            menuOpen
              ? "text-black/90"
              : "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]"
          }`}
        >
          cloverfield
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-base font-[family-name:var(--font-outfit)] font-medium transition-all duration-300 ${
                item.href === "/sight"
                  ? "sight-nav-link" // background-clip:text — a hover bg would get clipped to the letters
                  : "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] hover:text-black hover:bg-[#CDFF50] hover:[text-shadow:none]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Audio Toggle */}
          <AudioToggle />

          {/* CTA Button */}
          <Link
            href="/#contact"
            className="ml-2 px-6 py-2.5 rounded-lg text-base font-[family-name:var(--font-outfit)] font-medium bg-white text-black hover:bg-[#CDFF50] transition-all duration-300"
          >
            Get Started
          </Link>
        </nav>

        {/* Hamburger (mobile) */}
        <button
          className="relative z-50 md:hidden flex flex-col justify-center gap-[5px] w-7 h-7 bg-transparent border-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-full h-[2px] rounded-sm transition-all duration-300 origin-center ${
              menuOpen ? "bg-black" : "bg-white/85"
            } ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block w-full h-[2px] rounded-sm transition-all duration-300 ${
              menuOpen ? "bg-black" : "bg-white/85"
            } ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-full h-[2px] rounded-sm transition-all duration-300 origin-center ${
              menuOpen ? "bg-black" : "bg-white/85"
            } ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Full-page mobile menu */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
