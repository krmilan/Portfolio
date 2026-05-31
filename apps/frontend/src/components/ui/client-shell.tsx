"use client";

import { useState, useEffect, useRef } from "react";
import BgOrbs from "@/components/ui/bg-orbs";
import Navbar from "@/components/ui/navbar";
import HeroSection from "@/components/sections/hero";
import SkillsSection from "@/components/sections/skills";
import ProjectsSection from "@/components/sections/projects";
import ChatSection from "@/components/sections/chat";
import Footer from "@/components/sections/footer";
import LoadingScreen from "@/components/ui/loading-screen";
import Mascot from "@/components/ui/mascot";

type MascotState = "idle" | "typing" | "active" | "sleeping" | "blinking";

const SECTION_IDS = ["about", "skills", "projects", "chat", "footer-section"];

export default function ClientShell() {
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [appReady, setAppReady] = useState<boolean>(false);

  useEffect(() => {
    if (sessionStorage.getItem("portfolio_loaded")) setAppReady(true);
  }, []);
  
  const currentIndex = useRef(0);
  const isScrolling = useRef(false);


  function handleLoadComplete() {
    sessionStorage.setItem("portfolio_loaded", "true");
    setAppReady(true);
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const chatMessages = document.querySelector("[data-chat-messages]");
      if (chatMessages && chatMessages.contains(e.target as Node)) return;
      e.preventDefault();
      if (isScrolling.current) return;
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.min(Math.max(currentIndex.current + direction, 0), SECTION_IDS.length - 1);
      if (nextIndex === currentIndex.current) return;
      currentIndex.current = nextIndex;
      isScrolling.current = true;
      document.getElementById(SECTION_IDS[nextIndex])?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => { isScrolling.current = false; }, 900);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 40) return;
      const chatMessages = document.querySelector("[data-chat-messages]");
      if (chatMessages && chatMessages.contains(e.target as Node)) return;
      if (isScrolling.current) return;
      const direction = diff > 0 ? 1 : -1;
      const nextIndex = Math.min(Math.max(currentIndex.current + direction, 0), SECTION_IDS.length - 1);
      if (nextIndex === currentIndex.current) return;
      currentIndex.current = nextIndex;
      isScrolling.current = true;
      document.getElementById(SECTION_IDS[nextIndex])?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => { isScrolling.current = false; }, 900);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <>
      {!appReady && <LoadingScreen onComplete={handleLoadComplete} />}
      <main style={{ background: "#080810" }}>
        <BgOrbs />
        <Navbar />
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <ChatSection onMascotStateChange={setMascotState} />
        <div id="footer-section"><Footer /></div>
      </main>
      <Mascot />
    </>
  );
}
