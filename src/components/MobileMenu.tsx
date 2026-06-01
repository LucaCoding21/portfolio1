"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { NAV_ITEMS } from "@/data/projects";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Build GSAP timeline once on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      // Circle expand from hamburger position (top-right)
      tl.fromTo(
        overlayRef.current,
        { clipPath: "circle(0% at 90% 4%)", visibility: "visible" },
        {
          clipPath: "circle(150% at 90% 4%)",
          duration: 0.8,
          ease: "power4.inOut",
        }
      );

      // Nav items stagger in — starts overlapping with circle at 0.4s
      tl.fromTo(
        navItemsRef.current.filter(Boolean),
        { opacity: 0, y: 60, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.4
      );

      // CTA button fades in after nav items
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        0.65
      );

      tlRef.current = tl;
    });

    return () => ctx.revert();
  }, []);

  // Play / reverse timeline based on isOpen
  useEffect(() => {
    if (!tlRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      tlRef.current.timeScale(1).play();
    } else {
      tlRef.current.timeScale(1.4).reverse();
      // Unlock scroll after reverse animation completes
      const duration = tlRef.current.duration() / 1.4;
      const timeout = setTimeout(() => {
        document.body.style.overflow = "";
      }, duration * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Cleanup scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // For same-page hash links, smooth-scroll instead of routing
    const isHomeHash = href.startsWith("/#");
    const hash = isHomeHash ? href.slice(1) : href.startsWith("#") ? href : null;
    const onHome = pathname === "/";

    if (hash && onHome) {
      e.preventDefault();
      onClose();
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    // Cross-page navigation — close menu, then let the router push
    e.preventDefault();
    onClose();
    setTimeout(() => {
      router.push(href);
    }, 200);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 bg-white md:hidden flex flex-col justify-center px-8"
      style={{ clipPath: "circle(0% at 90% 4%)", visibility: "hidden" }}
    >
      {/* Nav items */}
      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((item, i) => (
          <Link
            key={item.label}
            ref={(el) => { navItemsRef.current[i] = el; }}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className="block font-[family-name:var(--font-outfit)] font-bold text-[15vw] leading-[0.95] text-black transition-colors duration-300 hover:text-[#CDFF50]"
            style={{ opacity: 0 }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* CTA */}
      <Link
        ref={ctaRef}
        href="/#contact"
        onClick={(e) => handleNavClick(e, "/#contact")}
        className="mt-12 self-start px-8 py-4 rounded-full bg-black text-white text-lg font-[family-name:var(--font-outfit)] font-medium transition-colors duration-300 hover:bg-[#CDFF50] hover:text-black"
        style={{ opacity: 0 }}
      >
        Get Started
      </Link>
    </div>
  );
}
