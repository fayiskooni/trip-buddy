import { HomeView } from "@/module/home/ui/views/home-view";
import React from "react";
import { verifySession } from "@/lib/auth";

const page = async () => {
  await verifySession();
  return <HomeView />;
};

export default page;