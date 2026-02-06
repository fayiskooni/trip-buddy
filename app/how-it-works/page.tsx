import AnimatedNavigationTabsDemo from "@/components/navbar";

const page = () => {
  return (
    <div className="w-full h-screen ">
      <AnimatedNavigationTabsDemo />
      <main className="flex items-center justify-center">
        <h1 className="text-6xl font-semibold">How</h1>
      </main>
    </div>
  );
};

export default page;
