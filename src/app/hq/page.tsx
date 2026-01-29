export const metadata = {
  title: "OBM HQ | Olsen Brands Management",
  robots: "noindex, nofollow",
};

export default function HQPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <iframe
        src="https://steve-kanban.vercel.app"
        className="w-full h-screen border-0"
        title="Olsen HQ Kanban"
      />
    </div>
  );
}
