"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Removed SheetDescription as it's typically not used for simple navigation

import { ModeToggle } from "./theme-btn"; // Assuming theme-btn is in the same 'components' directory
import LoadingBar from "react-top-loading-bar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Start progress when route changes
    setProgress(30);
    const timer = setTimeout(() => {
      setProgress(70);
    }, 200);

    // Final progress when route fully loads
    const completeTimer = setTimeout(() => {
      setProgress(100);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
      const resetTimer = setTimeout(() => setProgress(0), 100);
      return () => clearTimeout(resetTimer);
    };
  }, [pathname]);

  // Initial load effect - only runs once on component mount
  useEffect(() => {
    setProgress(100);
    const resetInitialProgress = setTimeout(() => setProgress(0), 100);
    return () => clearTimeout(resetInitialProgress);
  }, []);

  return (
    <nav className="p-4 bg-background/80 sticky top-0 backdrop-blur-lg border-b border-border z-50 transition-all duration-300">
      <LoadingBar
        color="#8B5CF6" // A vibrant purple for the loading bar
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={3} // Slightly thicker for better visibility
        waitingTime={400} // Optional: Add a slight delay before it starts for very fast navigations
      />
      <div className="container mx-auto flex justify-between items-center h-8 md:h-10">
        {" "}
        {/* Slightly increased height for a more substantial feel */}
        {/* Brand/Logo */}
        <Link href={"/"} className="flex items-center group">
          <span className="text-3xl md:text-4xl font-extrabold text-primary transition-colors duration-300 group-hover:text-purple-600">
            T
          </span>
          <span className="text-xl md:text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-purple-600 ml-0.5">
            {" "}
            {/* Added slight margin for spacing */}
            ypoTales
          </span>
        </Link>
        {/* Desktop Navigation Links and Theme Toggle */}
        <div className="hidden md:flex items-center space-x-8">
          {" "}
          {/* Increased spacing */}
          <NavLink href="/">Home</NavLink>
          <NavLink href="/blog">Blogs</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <div className="ml-6">
            {" "}
            {/* Added more space before the toggle for visual separation */}
            <ModeToggle />
          </div>
        </div>
        {/* Mobile Navigation (Hamburger menu and Theme Toggle) */}
        <div className="md:hidden flex items-center space-x-2">
          <ModeToggle /> {/* ModeToggle stays here for mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="focus-visible:ring-offset-0 focus-visible:ring-0"
              >
                {" "}
                {/* Improved focus state */}
                <svg
                  className="w-7 h-7" // Slightly larger icon
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col p-6">
              {" "}
              {/* More padding */}
              <SheetHeader>
                <SheetTitle className="font-extrabold text-4xl my-6 text-primary border-b pb-4">
                  {" "}
                  {/* Larger title, bottom border */}
                  TypoTales
                </SheetTitle>
                {/* SheetDescription removed as it's typically not needed here */}
              </SheetHeader>
              <nav className="flex flex-col gap-6 text-xl font-medium flex-grow py-4">
                {" "}
                {/* Increased font size and vertical padding */}
                <MobileNavLink href="/">Home</MobileNavLink>
                <MobileNavLink href="/blog">blogs</MobileNavLink>
                <MobileNavLink href="/contact">Contact</MobileNavLink>
              </nav>
              {/* No login/signup buttons here */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// Helper component for desktop navigation links
// Note: If you're not using TypeScript, remove ': { href: string; children: React.ReactNode }'
const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative py-2 text-foreground/70 hover:text-foreground transition-all duration-300 group
        ${isActive ? "font-semibold text-foreground after:scale-x-100" : ""}
        after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-full after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100`} /* Adjusted line height and added ease-out */
    >
      {children}
      {/* Optional: Add a subtle glow/shine on active link (requires custom CSS animation) */}
      {isActive && (
        <span className="absolute -bottom-0.5 left-0 w-full h-1 bg-primary/20 rounded-full blur-sm animate-pulse-once"></span>
      )}
    </Link>
  );
};

// Helper component for mobile navigation links (inside Sheet)
// Note: If you're not using TypeScript, remove ': { href: string; children: React.ReactNode }'
const MobileNavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative py-3 px-2 rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-primary/10 text-primary font-bold shadow-sm"
            : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
        }`}
    >
      {children}
    </Link>
  );
};
