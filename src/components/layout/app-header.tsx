import Link from "next/link";
import { EduviaMark } from "@/components/icons/eduvia-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/students" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <EduviaMark className="h-4.5 w-4.5" />
          </span>
          <span className="text-sm sm:text-base">
            Eduvia <span className="text-muted-foreground font-normal">· Student Management</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <UserMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}