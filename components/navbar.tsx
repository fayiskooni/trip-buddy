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

  // If the user is an organizer, attach the Manage Trip link
  const items = session?.user?.role === "ORGANIZER" 
    ? [...baseItems, { id: 5, tile: "Manage Trip", href: "/manage-trip" }]
    : baseItems;

  return (
    <div className="w-full">
      <AnimatedNavigationTabs items={items} />
    </div>
  );
}
