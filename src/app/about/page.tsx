import { Footer } from "@/components/layout/Footer";
import { MaskedAbout } from "@/components/ui/MaskedAbout";

export default function AboutPage() {
  return (
    <main data-chapter="about" className="pt-24">
      <MaskedAbout />
      <Footer />
    </main>
  );
}
