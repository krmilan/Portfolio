"use client";

import { useState, useEffect } from "react";
import BgOrbs from "@/components/ui/bg-orbs";
import Navbar from "@/components/ui/navbar";
import HeroSection from "@/components/sections/hero";
import SkillsSection from "@/components/sections/skills";
import ProjectsSection from "@/components/sections/projects";
import ExperienceSection from "@/components/sections/experience";
import ChatSection from "@/components/sections/chat";
import Footer from "@/components/sections/footer";
import LoadingScreen from "@/components/ui/loading-screen";

export default function ClientShell() {
  const [appReady, setAppReady] = useState<boolean>(false);

  useEffect(() => {
    if (sessionStorage.getItem("portfolio_loaded")) setAppReady(true);
  }, []);

  // Navbar anchor clicks: scroll to section
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null;
      // Only handle clicks that originate from nav or footer nav elements
      if (!anchor) return;
      if (!anchor.closest("nav, footer")) return;

      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;

      const section = document.getElementById(id);
      if (!section) return;

      e.preventDefault();
      section.scrollIntoView({ behavior: "smooth" });
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  function handleLoadComplete() {
    sessionStorage.setItem("portfolio_loaded", "true");
    setAppReady(true);
  }

  return (
    <>
      {!appReady && <LoadingScreen onComplete={handleLoadComplete} />}
      <main style={{ background: "#080810" }}>
        <BgOrbs />
        <Navbar />
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ChatSection />
        <Footer />
      </main>
    </>
  );
}
