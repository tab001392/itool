"use client";

import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  openSidebar?: () => void;
  closeSidebar?: () => void;
}

export const SidebarToggle = ({
  isOpen,
  openSidebar,
  closeSidebar,
}: SidebarToggleProps) => {
  return (
    <div className="invisible lg:visible absolute top-[12px] -right-[16px] z-20">
      <Button
        onClick={isOpen ? closeSidebar : openSidebar}
        className="rounded-md w-8 h-8"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-700",
            !isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
};
