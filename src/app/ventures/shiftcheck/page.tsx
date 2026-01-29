import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShiftCheckContent } from "./content";

export const metadata = {
  title: "ShiftCheck | Olsen Brands Management",
  description: "Restaurant accountability platform with photo-verified checklists.",
};

export default function ShiftCheckPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ShiftCheckContent />
      <Footer />
    </div>
  );
}
