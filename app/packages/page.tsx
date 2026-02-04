import AnimatedNavigationTabsDemo from "@/components/navbar";

const page = () => {
  return (
    <div className="w-full">
      <AnimatedNavigationTabsDemo />
      <main className="h-screen flex items-center justify-center">
        <h1 className="text-6xl font-semibold">Packages</h1>
      </main>
    </div>
  );
};

export default page;
