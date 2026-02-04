import { AnimatedNavigationTabs } from "@/components/ui/animated-navigation-tabs";

const AnimatedNavigationTabsDemo = () => (
  <div className="w-full">
    <AnimatedNavigationTabs items={ITEMS} />
  </div>
);

export default AnimatedNavigationTabsDemo;

const ITEMS = [
  { id: 1, tile: "Home", href: "/home" },
  { id: 2, tile: "Packages", href: "/packages" },
  { id: 3, tile: "Gallery", href: "/gallery" },
  { id: 4, tile: "How it works", href: "/how-it-works" },
  { id: 5, tile: "Contact", href: "/contact" },
];
