import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClintonComebackContent } from "./content";

export const metadata = {
  title: "Clinton Comeback | Olsen Brands Management",
  description: "Gamified shop-local civic engagement platform launching February 2026.",
};

export default function ClintonComebackPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ClintonComebackContent />
      <Footer />
    </div>
  );
}
