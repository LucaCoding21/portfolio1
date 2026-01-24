"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";

interface Project {
  id: number;
  name: string;
  description: string;
  tags: string;
  bgColor: string;
  image: string;
  phoneImage?: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "Njagih Studios",
    description: "Crafting visual stories for artists and creatives through bold photography.",
    tags: "Photography, Brand Identity, Creative Direction",
    bgColor: "#1a1f2e",
    image: "/njagih2.jpg",
    phoneImage: "/njagih studios.png",
  },
  {
    id: 2,
    name: "Nexus",
    description: "Reimagining digital experiences for tomorrow.",
    tags: "Strategy, Product Design, Engineering",
    bgColor: "#2d1f3d",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
    phoneImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=600&fit=crop",
  },
  {
    id: 3,
    name: "Prism",
    description: "Building intelligent interfaces that inspire.",
    tags: "AI Integration, Product Design, Brand",
    bgColor: "#1f2d2d",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=600&fit=crop",
    phoneImage: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=300&h=600&fit=crop",
  },
  {
    id: 4,
    name: "Aurora",
    description: "Designing seamless fintech solutions.",
    tags: "Fintech, Product Design, Development",
    bgColor: "#2d2d1f",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    phoneImage: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=300&h=600&fit=crop",
  },
  {
    id: 5,
    name: "Vertex",
    description: "Creating immersive healthcare platforms.",
    tags: "Healthcare, UX Research, Development",
    bgColor: "#1f2937",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    phoneImage: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=300&h=600&fit=crop",
  },
  {
    id: 6,
    name: "Cipher",
    description: "Securing the next generation of digital assets.",
    tags: "Web3, Security, Brand Identity",
    bgColor: "#0f172a",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    phoneImage: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=300&h=600&fit=crop",
  },
];

const menuItems = [
  { label: "Work", href: "#" },
  { label: "Services", href: "#" },
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Home() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [displayedProject, setDisplayedProject] = useState<Project | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Refs for hero/project animations
  const overlayRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const companyDescRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Refs for menu animation
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const heroUIRef = useRef<HTMLDivElement>(null);

  // Initialize menu timeline
  useEffect(() => {
    const menuTl = gsap.timeline({ paused: true });

    menuTl
      .to(heroUIRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      }, 0)
      .to(heroWrapperRef.current, {
        width: "35%",
        height: "80%",
        top: "10%",
        left: "38%",
        borderRadius: "12px",
        duration: 1,
        ease: "power3.inOut",
      }, 0)
      // Offset content to keep video visually stationary
      .to(heroContentRef.current, {
        x: "-38vw",
        y: "-10vh",
        duration: 1,
        ease: "power3.inOut",
      }, 0)
      .set(menuContentRef.current, {
        opacity: 1,
      }, 0)
      .fromTo(
        menuItemsRef.current.filter(Boolean),
        { x: "-100%", opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.5,
          ease: "power3.out"
        },
        0.05
      );

    menuTimelineRef.current = menuTl;

    return () => {
      menuTl.kill();
    };
  }, []);

  const toggleMenu = useCallback(() => {
    if (!menuTimelineRef.current) return;

    if (menuOpen) {
      // Hide menu items first, then reverse the frame
      gsap.to(menuItemsRef.current.filter(Boolean), {
        x: "-100%",
        opacity: 0,
        duration: 0.4,
        stagger: 0.03,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(menuContentRef.current, { opacity: 0 });
          menuTimelineRef.current?.reverse();
        }
      });
    } else {
      menuTimelineRef.current.timeScale(1).play();
    }
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

  const animateProjectIn = useCallback((project: Project) => {
    if (menuOpen) return;

    // Kill any existing animation and start fresh
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    setIsAnimating(true);
    setActiveProject(project);
    setDisplayedProject(project);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });
    timelineRef.current = tl;

    tl.to(companyDescRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.inOut",
    }, 0);

    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    }, 0);

    // Simple left-to-right reveal for phone
    tl.fromTo(
      phoneRef.current,
      { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)", opacity: 1 },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", opacity: 1, duration: 0.5, ease: "power2.out" },
      0.2
    );

    tl.fromTo(
      titleRef.current,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      0.15
    );

    tl.fromTo(
      descRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      0.2
    );

    tl.fromTo(
      tagsRef.current,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      0.25
    );
  }, [menuOpen]);

  const animateProjectOut = useCallback(() => {
    if (!activeProject) return;

    // Kill any existing animation and start the out animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    setIsAnimating(true);
    setActiveProject(null);

    const tl = gsap.timeline({
      onComplete: () => {
        setDisplayedProject(null);
        setIsAnimating(false);
      },
    });
    timelineRef.current = tl;

    // Simple fade out - everything fades together
    tl.to(overlayRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" }, 0);
    tl.to(phoneRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" }, 0);
    tl.to(titleRef.current, { x: 60, opacity: 0, duration: 0.4, ease: "power2.in" }, 0);
    tl.to(descRef.current, { y: 40, opacity: 0, duration: 0.3, ease: "power2.in" }, 0);
    tl.to(tagsRef.current, { x: 40, opacity: 0, duration: 0.3, ease: "power2.in" }, 0);
    tl.to(companyDescRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.1);
  }, [activeProject]);

  useEffect(() => {
    gsap.fromTo(
      headlineRef.current,
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.5 }
    );
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Menu Background - White, always behind */}
      <div className="menu-bg" />

      {/* Hero Wrapper - This animates size */}
      <div
        ref={heroWrapperRef}
        className="hero-wrapper"
      >
        {/* Hero Content - Stays full size, gets clipped */}
        <div ref={heroContentRef} className="hero-content">
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="video-bg"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay for video */}
          <div className="fixed inset-0 bg-black/10 z-[0]" />

          {/* Project Background Overlay */}
          <div
            ref={overlayRef}
            className="project-overlay"
            style={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: displayedProject?.bgColor || "#0a0a0a",
              }}
            >
              {displayedProject && (
                <Image
                  src={displayedProject.image}
                  alt={displayedProject.name}
                  fill
                  className="object-cover opacity-40"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>
          </div>

          {/* Hero UI Elements - Hidden when menu is open */}
          <div ref={heroUIRef}>
            {/* Project List - Left Side */}
            <nav
              className="fixed left-12 top-1/2 -translate-y-1/2 z-50 flex flex-col"
            >
              {projects.map((project) => (
                <button
                  key={project.id}
                  className={`project-item ${activeProject?.id === project.id ? "active" : ""}`}
                  onMouseEnter={() => animateProjectIn(project)}
                  onMouseLeave={animateProjectOut}
                >
                  {project.name}
                </button>
              ))}
              <button className="project-item-all">All Work</button>
            </nav>

            {/* Project Showcase - Small Image Only */}
            <div className="fixed inset-0 z-40 pointer-events-none">
              <div
                ref={phoneRef}
                className="project-showcase"
                style={{ bottom: "10%", right: "10%", width: "280px", perspective: "1000px", opacity: 0 }}
              >
                {displayedProject && (
                  <div className="relative rounded-[24px] overflow-hidden shadow-2xl bg-black p-2">
                    <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden">
                      <Image
                        src={displayedProject.phoneImage || displayedProject.image}
                        alt={`${displayedProject.name} mobile`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div ref={titleRef} className="project-info" style={{ bottom: "15%", left: "25%", opacity: 0 }}>
                <h2 className="project-title">{displayedProject?.name}</h2>
              </div>

              <div ref={descRef} className="project-info" style={{ top: "35%", right: "38%", opacity: 0, maxWidth: "320px" }}>
                <p className="project-description">{displayedProject?.description}</p>
              </div>

              <div ref={tagsRef} className="project-info" style={{ bottom: "18%", right: "8%", opacity: 0 }}>
                <p className="project-tags">{displayedProject?.tags}</p>
              </div>
            </div>

            {/* Main Headline - Center */}
            <div
              ref={headlineRef}
              className="fixed bottom-[8%] left-1/2 -translate-x-1/2 z-30 text-center whitespace-nowrap"
              style={{ opacity: 0 }}
            >
              <h1 className="headline">
                built with care
              </h1>
            </div>

            {/* Loader - Center */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="loader" />
            </div>

            {/* Company Description - Right Side */}
            <div ref={companyDescRef} className="fixed top-1/2 right-12 -translate-y-1/2 z-30 max-w-[240px] text-right">
              <p className="company-description">
                Building digital products for ambitious brands since 2020.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header - Above hero wrapper */}
      <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between">
        <button
          className={`menu-btn ${menuOpen ? 'menu-btn-dark' : ''}`}
          onClick={toggleMenu}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <div className={`logo-text transition-all duration-700 ${menuOpen ? 'text-black/80' : 'text-white/80'}`}>
          Studio
        </div>

        <div className={`header-meta transition-all duration-700 ${menuOpen ? 'text-black/40' : 'text-white/40'}`}>
          <span>NYC</span>
          <span className="mx-2">·</span>
          <span>10:33 AM</span>
        </div>
      </header>

      {/* Menu Content - Fades in when open */}
      <nav
        ref={menuContentRef}
        className={`menu-content ${menuOpen ? 'open' : ''}`}
      >
        <div className="menu-items-container">
          {menuItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              ref={(el) => { menuItemsRef.current[index] = el; }}
              className="menu-nav-item"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Menu Footer */}
        <div className="menu-footer">
          <div className="menu-footer-col">
            <span className="menu-footer-label">Get in touch</span>
            <a href="mailto:hello@studio.com" className="menu-footer-link">hello@studio.com</a>
          </div>
          <div className="menu-footer-col">
            <span className="menu-footer-label">Follow us</span>
            <div className="menu-footer-social">
              <a href="#" className="menu-footer-link">Twitter</a>
              <a href="#" className="menu-footer-link">LinkedIn</a>
              <a href="#" className="menu-footer-link">Instagram</a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
