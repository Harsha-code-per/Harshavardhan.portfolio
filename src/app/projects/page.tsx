import { Footer } from "@/components/layout/Footer";
import { HorizontalProjects } from "@/components/ui/HorizontalProjects";

export default function ProjectsPage() {
  return (
    <main className="bg-[var(--bg-base)] pt-24">
      <HorizontalProjects />
      <Footer />
    </main>
  );
}
