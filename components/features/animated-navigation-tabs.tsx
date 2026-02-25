"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { logout } from "@/app/actions/logout";

interface Props {
  id: string | number;
  href: string;
  tile: string;
}

export function AnimatedNavigationTabs({ items }: { items: Props[] }) {
  const [isHover, setIsHover] = useState<Props | null>(null);
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    await logout();
  };

  return (
    <nav className="relative w-full flex items-center justify-between px-8 py-6">
      <div className="font-semibold text-xl tracking-tight glass p-2 px-6 rounded-2xl text-foreground/80">
        TripBuddy
      </div>

      <div className="relative glass p-1 rounded-3xl">
        <ul className="flex items-center justify-center">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href === "/home" ? "/" : item.href}
                className={cn(
                  "relative p-0.5 transition-colors duration-300",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onMouseEnter={() => setIsHover(item)}
                onMouseLeave={() => setIsHover(null)}
              >
                <div className="px-5 py-2 relative">
                  <span className="relative z-10">{item.tile}</span>

                  {(isHover?.id === item.id || isActive) && (
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-muted"
                      style={{ borderRadius: 20 }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <Button asChild className="flex items-center gap-3 glass px-2 py-1 rounded-full h-14 bg-transparent hover:bg-foreground/5 text-foreground border-none shadow-none">
          <Link href="/create-trip" className="flex items-center">
            <span className="px-3 text-foreground/80 whitespace-nowrap">
              Make Your Trip
            </span>

            <span className="flex items-center justify-center h-10 w-10 bg-primary rounded-full transition-transform hover:scale-110">
              <ArrowUpRight className="h-5 w-5 text-primary-foreground" />
            </span>
          </Link>
        </Button>
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="font-medium text-base tracking-tight glass hover:bg-foreground/5 disabled:opacity-50 transition-colors px-6 h-14 rounded-full text-foreground/80 flex items-center justify-center"
        >
         {isLoggingOut ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </nav>
  );
}
