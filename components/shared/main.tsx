"use client";

import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

export const Main = ({ children }: Props) => {
  const sidebar = useSidebarToggle((state) => state.isOpen);

  return (
    <main
      className={cn(
        "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
        !sidebar ? "lg:ml-[90px]" : "lg:ml-72"
      )}
    >
      {children}
    </main>
  );
};
