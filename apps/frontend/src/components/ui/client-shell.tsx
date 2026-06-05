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

const SECTION_IDS = ["about", "skills", "projects", "chat", "footer-section"];

export default function ClientShell() {
  const [appReady, setAppReady] = useState<boolean>(false);
  const isSnapping = useRef(false);
  const currentSection = useRef(0);

  useEffect(() => {
    if (sessionStorage.getItem("portfolio_loaded")) setAppReady(true);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    // Track which section is currently most visible
    const updateCurrentSection = () => {
      const viewportMid = window.scrollY + window.innerHeight / 2;
      let closest = 0;
      let closestDist = Infinity;
      sections.forEach((s, i) => {
        const mid = s.offsetTop + s.offsetHeight / 2;
        const dist = Math.abs(mid - viewportMid);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      currentSection.current = closest;
    };

    const snapToNext = (direction: 1 | -1) => {
      if (isSnapping.current) return;
      const idx = currentSection.current;
      const section = sections[idx];
      if (!section) return;

      const sectionBottom = section.offsetTop + section.offsetHeight;
      const viewportBottom = window.scrollY + window.innerHeight;
      const sectionTop = section.offsetTop;
      const viewportTop = window.scrollY;

      // Scrolling down: snap to next only when section bottom is within viewport
      if (direction === 1 && viewportBottom >= sectionBottom - 40 && idx < sections.length - 1) {
        isSnapping.current = true;
        currentSection.current = idx + 1;
        sections[idx + 1].scrollIntoView({ behavior: "smooth" });
        setTimeout(() => { isSnapping.current = false; }, 900);
        return;
      }

      // Scrolling up: snap to prev only when section top is within viewport
      if (direction === -1 && viewportTop <= sectionTop + 40 && idx > 0) {
        isSnapping.current = true;
        currentSection.current = idx - 1;
        sections[idx - 1].scrollIntoView({ behavior: "smooth" });
        setTimeout(() => { isSnapping.current = false; }, 900);
        return;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const chatMessages = document.querySelector("[data-chat-messages]");
      if (chatMessages && chatMessages.contains(e.target as Node)) return;
      updateCurrentSection();
      snapToNext(e.deltaY > 0 ? 1 : -1);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 40) return;
      const chatMessages = document.querySelector("[data-chat-messages]");
      if (chatMessages && chatMessages.contains(e.target as Node)) return;
      updateCurrentSection();
      snapToNext(diff > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
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
        <SkillsSection />
        <ProjectsSection />
        <ChatSection />
        <div id="footer-section">
          <Footer />
        </div>
      </main>
    </>
  );
}