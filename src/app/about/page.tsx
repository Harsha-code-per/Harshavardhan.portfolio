import { Footer } from "@/components/layout/Footer";
import { MaskedAbout } from "@/components/ui/MaskedAbout";

export default function AboutPage() {
  return (
    <main className="bg-[var(--bg-base)] pt-24">
      <MaskedAbout />
      <Footer />
    </main>
  );
}
