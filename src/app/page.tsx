import { CinematicDirector } from "@/components/layout/CinematicDirector";
import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/ui/About";
import { ContactSection } from "@/components/ui/ContactSection";
import { Hero } from "@/components/ui/Hero";
import { HorizontalProjects } from "@/components/ui/HorizontalProjects";
import { MarqueeBanner } from "@/components/ui/MarqueeBanner";
import { ResearchSection } from "@/components/ui/ResearchSection";
import { SkillsBento } from "@/components/ui/SkillsBento";
import { SportsSection } from "@/components/ui/SportsSection";
import { TimelineExperience } from "@/components/ui/TimelineExperience";
import { WorkShowcase } from "@/components/ui/WorkShowcase";

export default function Home() {
  return (
    <CinematicDirector>
      <div id="hero-tracker" className="absolute top-0 w-full h-[100vh] pointer-events-none" />
      <div id="hero-master-container" className="relative z-0 h-screen w-full">
        <Hero />
      </div>

      <div className="h-[100vh] w-full pointer-events-none" />

      <div className="relative z-10 w-full">
        <About />
        <WorkShowcase />
        <HorizontalProjects />
        <SkillsBento />
        <TimelineExperience />
        <ResearchSection />
        <MarqueeBanner />
        <SportsSection />
        <ContactSection />
        <Footer />
      </div>
    </CinematicDirector>
  );
}
