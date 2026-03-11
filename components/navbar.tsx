"use client";

import { useSession } from "next-auth/react";
import { AnimatedNavigationTabs } from "@/components/features/animated-navigation-tabs";

export default function AnimatedNavigationTabsDemo() {
  const { data: session } = useSession();

  const baseItems = [
    { id: 1, tile: "Home", href: "/" },
    { id: 2, tile: "Packages", href: "/packages" },
    { id: 3, tile: "Gallery", href: "/gallery" },
    { id: 4, tile: "How it works", href: "/how-it-works" },
  ];

  let items = [...baseItems];
  
  if (session?.user) {
    items.push({ id: 5, tile: "Joined Trips", href: "/joined-trips" });
    
    if (session.user.role === "ORGANIZER") {
      items.push({ id: 6, tile: "Manage Trip", href: "/manage-trip" });
    }
  }

  return (
    <div className="w-full">
      <AnimatedNavigationTabs items={items} />
    </div>
  );
}
