"use client";

import NextDynamic from "next/dynamic";
import { navItems } from "@/data";

import Hero from "./Hero";
import Grid from "./Grid";
import Footer from "./Footer";
import Experience from "./Experience";
import RecentProjects from "./RecentProjects";
import { FloatingNav } from "./ui/FloatingNavbar";

const SplashCursor = NextDynamic(
  () => import("./ui/SplashCursor"),
  { ssr: false }
);

const PageContent = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1024}
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        CURL={3}
        SPLAT_RADIUS={0.25}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
      />
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <Grid />
        <RecentProjects />
        <Experience />
        <Footer />
      </div>
    </main>
  );
};

export default PageContent;
