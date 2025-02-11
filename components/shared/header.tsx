 "use client"
 
 import { SignedIn, UserButton } from "@clerk/nextjs";
 
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "@/components/shared/mobile-menu";

interface Props {
  title: string;
}

export const Header = ({ title }: Props) => {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <MobileMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <ThemeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
