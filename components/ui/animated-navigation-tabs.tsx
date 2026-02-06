"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";

export function AnimatedNavigationTabs({ items }: { items: Props[] }) {
  const [isHover, setIsHover] = useState<Props | null>(null);
  const pathname = usePathname();

  return (
    <nav className="relative w-full flex items-center justify-evenly py-6">
      <div className="text-white font-semibold text-xl tracking-tight">
        TripBuddy
      </div>

      <div className="relative glass p-1 rounded-3xl">
        <ul className="flex items-center justify-center">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "relative p-0.5 transition-colors duration-300",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary",
                )}
                onMouseEnter={() => setIsHover(item)}
                onMouseLeave={() => setIsHover(null)}
              >
                <div className="px-5 py-2 relative">
                  <span className="relative z-10">{item.tile}</span>

                  {(isHover?.id === item.id || isActive) && (
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-[#f6f6f6]"
                      style={{ borderRadius: 20 }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </ul>
      </div>

      <Button className="flex items-center gap-3 glass px-2 py-1 rounded-full h-14">
        <Link href="/create-trip" className="flex items-center">
          <span className="px-3 text-white whitespace-nowrap">
            Make Your Trip
          </span>

          <span className="flex items-center justify-center h-10 w-10 bg-white rounded-full">
            <ArrowUpRight className="h-5 w-5 text-black" />
          </span>
        </Link>
      </Button>
    </nav>
  );
}
