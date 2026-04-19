import { Footer } from "@/components/layout/Footer";
import { WorkShowcase } from "@/components/ui/WorkShowcase";

export default function WorkPage() {
  return (
    <main className="bg-[var(--bg-base)] pt-24">
      <WorkShowcase />
      <Footer />
    </main>
  );
}
