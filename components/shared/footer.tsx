"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

export const Footer = () => {
  const sidebar = useSidebarToggle((state) => state.isOpen);

  return (
    <footer
      className={cn(
        "transition-[margin-left] ease-in-out duration-300",
        !sidebar ? "lg:ml-[90px]" : "lg:ml-72"
      )}
    >
      <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-4 md:mx-8 flex h-14 items-center">
          <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
            Developed with ❤️ by{" "}
            <Link
              href="mailto:tab001392@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              TAB
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};
