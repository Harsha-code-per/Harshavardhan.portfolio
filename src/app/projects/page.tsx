import { Footer } from "@/components/layout/Footer";
import { HorizontalProjects } from "@/components/ui/HorizontalProjects";

export default function ProjectsPage() {
  return (
    <main data-chapter="projects" className="pt-24">
      <HorizontalProjects />
      <Footer />
    </main>
  );
}
