import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StoryContent } from "./content";

export const metadata = {
  title: "Our Story | Olsen Brands Management",
  description: "From garage bands to business brands. The story of Olsen Brands Management.",
};

export default function StoryPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <StoryContent />
      <Footer />
    </div>
  );
}
