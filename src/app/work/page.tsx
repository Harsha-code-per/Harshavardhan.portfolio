import { Footer } from "@/components/layout/Footer";
import { WorkShowcase } from "@/components/ui/WorkShowcase";

export default function WorkPage() {
  return (
    <main data-chapter="work" className="pt-24">
      <WorkShowcase />
      <Footer />
    </main>
  );
}
