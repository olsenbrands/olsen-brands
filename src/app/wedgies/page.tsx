import Link from 'next/link';
import { MapPin, Clock, ExternalLink, Users } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// ─── Menu Data ─────────────────────────────────────────

const signatureWedgies = [
  {
    name: 'Blue Bacon Wedgie',
    description:
      'Iceberg Wedge, Fresh Cut Greens, Blue Cheese Dressing, Bacon, Blue Cheese Crumbles, Tomato, Red Onion, Dried Cranberries, Chives, Salt & Pepper',
  },
  {
    name: 'Green Goddess Wedgie',
    description:
      'Romaine Wedge, Bed of Spinach, Homemade Green Goddess Dressing, Bacon, Avocado, Hardboiled Egg, Parmesan Cheese, Cherry Tomato, Red Onion, Cucumber, Broccoli, Chives, Croutons, Salt & Pepper, Oregano',
  },
  {
    name: 'Down Home Wedgie',
    description:
      'Iceberg Wedge, Fresh Cut Greens, Homemade Ranch Dressing, Grilled Chicken, Ham, Cheddar Cheese, Tomato, Cucumber, Peas, Broccoli, Croutons, Chives, Salt & Pepper, Oregano',
  },
  {
    name: "Caesar's Big Time Wedgie",
    description:
      'Romaine Wedge, Bed of Spinach, Caesar Dressing, Grilled Chicken, Bacon, Parmesan Cheese, Tomato, Red Onion, Cucumber, Croutons, Salt & Pepper, Oregano',
  },
  {
    name: 'Good Greek Wedgie',
    description:
      'Romaine Wedge, Bed of Spinach, Greek Dressing, Shaved Lamb, Feta, Tomato, Red Onion, Cucumber, Green Pepper, Greek Olives, Pepperoncini Pepper, Tzatziki Sauce',
  },
  {
    name: 'Chicken Bacon Avocado Wedgie',
    description:
      'Iceberg Wedge, Fresh Cut Greens, Ranch Dressing, Crispy Chicken, Bacon, Cheddar Cheese, Avocado, Hardboiled Egg, Tomato, Cucumber, Avocado Ranch, Crouton, Chives, Salt & Pepper, Oregano',
  },
];

const tossedSalads = [
  {
    name: 'Balsamic Berry',
    description:
      'Fresh Cut Greens, Homemade Balsamic Vinaigrette, Feta, Strawberries, Blueberries, Raspberries, Dried Cranberries, Toasted Almonds',
  },
  {
    name: 'Mango Berry',
    description:
      'Fresh Cut Greens, Poppy Seed Dressing, Mangos, Strawberries, Blueberries, Raspberries, Dried Cranberries, Toasted Almonds',
  },
  {
    name: 'Santa Fe Salad w/ Burnt Ends',
    description:
      'Fresh Cut Greens, Tomatillo Lime Dressing, Burnt Ends, Cortina Cheese, Avocado, Black Beans, Corn, Tomato, Red Onions, Cilantro, Tortilla Strips, Lime Wedge, Crispy Jalapeños',
  },
  {
    name: "Elaine's Big Salad",
    description:
      'Fresh Cut Greens, Choice of Dressing, Grilled Chicken, Ham, Bacon, Avocado, Hardboiled Egg, Cheddar Cheese, Red Onion, Tomato, Broccoli, Cucumber, Peas, Croutons, Chives, Salt & Pepper, Oregano',
  },
  {
    name: 'Garden Salad w/ Ranch',
    description:
      'Fresh Cut Greens, Ranch Dressing, Cheddar Cheese, Tomato, Cucumber, Red Onion, Croutons, Salt & Pepper, Oregano',
  },
  {
    name: 'Classic Caesar Salad',
    description: 'Romaine Lettuce, Caesar Dressing, Croutons, Parmesan Cheese',
  },
];

const eggys = [
  {
    name: 'Ham & Cheese Eggy',
    description: 'Fresh waffled Eggys, ham, pepper jack cheese, mayo, salt & pepper',
  },
  {
    name: 'Bacon, Ham & Cheese Eggy',
    description: 'Fresh waffled Eggys, ham, bacon, pepper jack cheese, mayo, salt & pepper',
  },
  {
    name: 'Atomic Eggy',
    description:
      'Fresh waffled Eggys, ham, bacon, pepper jack cheese, green pepper, red onion, fresh jalapeño, spinach, homemade sriracha mayo',
  },
];

const wacos = [
  {
    name: 'Waco — Ham & Cheese',
    description: 'Flour tortilla, fresh eggs, ham, cheddar cheese, mayo, chives, salt & pepper',
  },
  {
    name: 'Waco — Bacon, Ham & Cheese',
    description:
      'Flour tortilla, fresh eggs, ham, bacon, cheddar cheese, mayo, chives, salt & pepper',
  },
  {
    name: 'Atomic Waco',
    description:
      'Fresh egg, bacon, ham, pepper jack cheese, green onion, fresh jalapeño, green peppers, mayo, sriracha mayo — wrapped in a soft flour tortilla',
  },
];

const parfaits = [
  {
    name: 'Chia Seed Parfait — Strawberry & Blueberry',
    description: '12 oz cup with chia seed pudding, fresh strawberries, blueberries, and granola',
  },
  {
    name: 'Chia Seed Parfait — Raspberry & Mango',
    description: '12 oz cup with chia seed pudding, fresh raspberries, mango, and granola',
  },
  {
    name: 'Greek Yogurt Parfait — Strawberry & Blueberry',
    description:
      '12 oz parfait with vanilla, strawberry, and plain greek yogurt, fresh strawberries, blueberries, and granola',
  },
  {
    name: 'Greek Yogurt Parfait — Raspberry & Mango',
    description:
      '12 oz parfait with vanilla and strawberry greek yogurt, fresh raspberries, mango, and granola',
  },
  {
    name: 'Breakfast Banana Split',
    description:
      'A whole banana topped with vanilla and strawberry greek yogurt, fresh strawberries, raspberries, blueberries, almonds, and granola',
  },
];

// ─── Sub-components ────────────────────────────────────

function MenuSection({
  title,
  items,
  note,
}: {
  title: string;
  items: { name: string; description: string }[];
  note?: string;
}) {
  return (
    <div className="mb-16">
      <h3 className="text-xl font-bold text-[#efe5cd] mb-1">{title}</h3>
      {note && <p className="text-sm text-[#efe5cd]/40 mb-6">{note}</p>}
      {!note && <div className="h-px bg-[#efe5cd]/10 mb-6 mt-2" />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.name}
            className="p-5 bg-white/[0.03] border border-white/10 rounded-xl hover:border-[#c9533c]/30 transition-colors"
          >
            <p className="font-semibold text-[#efe5cd] mb-1">{item.name}</p>
            <p className="text-sm text-[#efe5cd]/50 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────

export default function WedgiesPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-24 px-6 overflow-hidden">
          {/* subtle background texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#c9533c]/5 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto relative">
            <div className="flex items-center gap-2 text-sm text-[#efe5cd]/40 mb-8">
              <Link href="/" className="hover:text-[#efe5cd]/70 transition-colors">
                Olsen Brands
              </Link>
              <span>/</span>
              <span className="text-[#efe5cd]/70">Wedgies</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logos/wedgies.jpg"
                alt="Wedgies"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-[#efe5cd] leading-none">
                  Wedgies
                </h1>
                <p className="text-[#c9533c] font-semibold mt-1 tracking-wide text-sm uppercase">
                  Greens, Proteins &amp; Ice Cream
                </p>
              </div>
            </div>

            <p className="text-[#efe5cd]/70 text-lg max-w-2xl leading-relaxed mb-8">
              Fresh wedge salads, one-of-a-kind breakfast items, and crazy good ice cream — all made
              to order at our drive-thru in Clinton, UT. We start with a wedge. Then we pile on.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://order.dripos.com/wedgies"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9533c] text-white font-semibold rounded-lg hover:bg-[#b8432c] transition-colors"
              >
                Order Online
                <ExternalLink size={16} />
              </a>
              <div className="flex items-center gap-1.5 text-sm text-[#efe5cd]/50">
                <MapPin size={14} />
                <span>Clinton, UT</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dole Whip Promo Banner */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl border border-[#c9533c]/30 bg-[#c9533c]/10 p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🍍</span>
                <div>
                  <p className="font-bold text-[#efe5cd] text-lg">Wedgies Now Has Dole Whip!</p>
                  <p className="text-[#efe5cd]/60 mt-1 text-sm leading-relaxed">
                    Smooth, pineapple-flavored soft-serve that&apos;s sweet, a little tart, super
                    fluffy — and dairy-free. You can basically tell yourself it&apos;s fruit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl">
              <h2 className="font-bold text-[#efe5cd] mb-3">Vibrant &amp; Nutritious</h2>
              <p className="text-[#efe5cd]/60 text-sm leading-relaxed">
                Every day our kitchen preps fresh-cut greens, colorful vegetables, and high-quality
                proteins to build gourmet salads that actually taste like something. From the Mango
                Berry to the Good Greek Wedgie, we use homemade dressings and real ingredients —
                nothing out of a bag.
              </p>
            </div>
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl">
              <h2 className="font-bold text-[#efe5cd] mb-3">Beyond the Salad</h2>
              <p className="text-[#efe5cd]/60 text-sm leading-relaxed">
                Our No Carb Eggys are a breakfast item you won&apos;t find anywhere else, and our
                Wacos (pronounced &ldquo;Wah-Co&rdquo;) are made fresh to order and have built a
                loyal following fast. Add in our chia seed pudding parfaits, greek yogurt parfaits,
                and thick shakes — there&apos;s always a reason to come back.
              </p>
            </div>
          </div>
        </section>

        {/* Hours */}
        <section className="py-6 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-5 bg-white/[0.03] border border-white/10 rounded-xl">
              <Clock size={20} className="text-[#c9533c] flex-shrink-0" />
              <div>
                <p className="text-xs text-[#efe5cd]/40 uppercase tracking-wider mb-1">
                  Winter Hours
                </p>
                <p className="text-[#efe5cd] font-semibold">
                  Mon – Sat &nbsp;·&nbsp; 10:00 AM – 8:30 PM
                </p>
                <p className="text-[#efe5cd]/50 text-sm">Sunday closed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-[#efe5cd]">The Menu</h2>
              <a
                href="https://order.dripos.com/wedgies"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#c9533c] text-white font-semibold rounded-lg hover:bg-[#b8432c] transition-colors"
              >
                Order Online
                <ExternalLink size={14} />
              </a>
            </div>

            <MenuSection title="Signature Wedgies" items={signatureWedgies} />
            <MenuSection title="Tossed Salads" items={tossedSalads} />

            {/* Proteins & Breakfast */}
            <div className="mb-16">
              <h3 className="text-xl font-bold text-[#efe5cd] mb-1">Proteins &amp; Breakfast</h3>
              <p className="text-sm text-[#efe5cd]/40 mb-6">Served all day (until 8:30 PM)</p>

              <h4 className="text-sm font-semibold text-[#c9533c] uppercase tracking-wider mb-4">
                Eggys — No Carb, All Flavor
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {eggys.map((item) => (
                  <div
                    key={item.name}
                    className="p-5 bg-white/[0.03] border border-white/10 rounded-xl hover:border-[#c9533c]/30 transition-colors"
                  >
                    <p className="font-semibold text-[#efe5cd] mb-1">{item.name}</p>
                    <p className="text-sm text-[#efe5cd]/50 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              <h4 className="text-sm font-semibold text-[#c9533c] uppercase tracking-wider mb-4">
                Wacos — Pronounced &ldquo;Wah-Co&rdquo;
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wacos.map((item) => (
                  <div
                    key={item.name}
                    className="p-5 bg-white/[0.03] border border-white/10 rounded-xl hover:border-[#c9533c]/30 transition-colors"
                  >
                    <p className="font-semibold text-[#efe5cd] mb-1">{item.name}</p>
                    <p className="text-sm text-[#efe5cd]/50 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <MenuSection title="Fresh Parfaits" items={parfaits} />

            {/* Ice Cream */}
            <div className="mb-16">
              <h3 className="text-xl font-bold text-[#efe5cd] mb-2">Crazy Good Ice Cream</h3>
              <div className="h-px bg-[#efe5cd]/10 mb-6" />
              <p className="text-[#efe5cd]/60 text-sm leading-relaxed mb-6">
                A wide selection of flavored cones and thick shakes with dozens of flavors to choose
                from — classic vanilla to indulgent Orange Dreamsicle, and everything in between.
                Plus Dole Whip, now available!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <p className="font-semibold text-[#efe5cd] mb-1">Flavored Cones</p>
                  <p className="text-sm text-[#efe5cd]/50">
                    Must be purchased in person — not available online.
                  </p>
                </div>
                <div className="p-5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <p className="font-semibold text-[#efe5cd] mb-1">Thick Shakes</p>
                  <p className="text-sm text-[#efe5cd]/50">
                    Must be purchased in person — not available online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order CTA */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[#efe5cd]/50 text-sm mb-4">Ready to build your Wedgie?</p>
            <a
              href="https://order.dripos.com/wedgies"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9533c] text-white font-bold text-lg rounded-xl hover:bg-[#b8432c] transition-colors"
            >
              Order Online Now
              <ExternalLink size={18} />
            </a>
          </div>
        </section>

        {/* Employee Resource */}
        <section className="py-12 px-6 border-t border-white/[0.06]">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-[#efe5cd]/30 uppercase tracking-wider mb-4">
              Team Resources
            </p>
            <Link
              href="/wedgies/employees"
              className="group inline-flex items-center gap-4 p-5 bg-white/[0.03] border border-white/10 rounded-xl hover:border-[#c9533c]/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#c9533c]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9533c]/20 transition-colors">
                <Users size={20} className="text-[#c9533c]" />
              </div>
              <div>
                <p className="font-semibold text-[#efe5cd]">Wedgies Team Members</p>
                <p className="text-sm text-[#efe5cd]/50 mt-0.5">
                  Onboarding, documentation, and training resources
                </p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const metadata = {
  title: 'Wedgies | Greens, Proteins & Ice Cream',
  description:
    'Fresh wedge salads, no-carb Eggys, Wacos, parfaits, and crazy good ice cream — all made to order at our Clinton, UT drive-thru.',
};
