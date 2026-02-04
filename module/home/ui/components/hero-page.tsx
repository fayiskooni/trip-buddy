import AnimatedNavigationTabsDemo from "@/components/navbar";
import Image from "next/image";

const HeroPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        src="/mountain.jpg"
        alt="background"
        fill
        className="-z-10 scale-x-[-1] "
        priority
      />

      <AnimatedNavigationTabsDemo />

      <div className="flex flex-col items-center justify-center p-20 text-white">
        <span className="glass text-sm p-2 px-6 rounded-2xl">
          Natural Wonder
        </span>
        <h1 className="text-6xl font-light mt-2">Unforgettable</h1>
        <h1
          className="text-6xl font-medium tracking-tight
    bg-linear-to-b
    from-white
    to-white/40
    bg-clip-text text-transparent"
        >
          Experience
        </h1>
      </div>
    </div>
  );
};

export default HeroPage;
