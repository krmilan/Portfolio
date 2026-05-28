import BgOrbs from "@/components/ui/bg-orbs";
import Navbar from "@/components/ui/navbar";
import Hero from "@/components/sections/hero";
import Skills from "@/components/sections/skills";
import Projects from "@/components/sections/projects";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main>
      <BgOrbs />
      <Navbar />
      <Hero />
      <Skills />
      <Projects />
      <Footer />
    </main>
  );
}