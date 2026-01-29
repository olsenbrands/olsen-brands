import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { VenturesGrid } from "@/components/VenturesGrid";
import { Philosophy } from "@/components/Philosophy";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <VenturesGrid />
        <Philosophy />
      </main>
      <Footer />
    </div>
  );
}
