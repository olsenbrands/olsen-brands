import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TonicBaseContent } from "./content";

export const metadata = {
  title: "TonicBase | Olsen Brands Management",
  description: "Modern music school management software built by music school operators.",
};

export default function TonicBasePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <TonicBaseContent />
      <Footer />
    </div>
  );
}
