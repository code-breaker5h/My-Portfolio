"use client";

import NextDynamic from "next/dynamic";

const PageContent = NextDynamic(
  () => import("@/components/PageContent"),
  { ssr: false }
);

const Home = () => {
  return <PageContent />;
};

export default Home;
