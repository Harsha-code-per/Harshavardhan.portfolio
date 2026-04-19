import { Footer } from "@/components/layout/Footer";
import { TimelineExperience } from "@/components/ui/TimelineExperience";

export default function JourneyPage() {
  return (
    <main className="bg-[var(--bg-base)] pt-24">
      <TimelineExperience />
      <Footer />
    </main>
  );
}
