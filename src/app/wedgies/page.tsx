import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, ExternalLink, Users } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// ─── Menu Data ─────────────────────────────────────────

const signatureWedgies = [
  {
    name: 'Chicken Bacon Avocado Wedgie',
    tagline: 'Our most popular salad.',
    description:
      'Iceberg wedge, fresh cut greens, ranch dressing, crispy chicken, bacon, cheddar cheese, avocado, hardboiled egg, tomato, cucumber, avocado ranch, croutons, chives, salt & pepper, oregano',
    price: '$12.49',
  },
  {
    name: "Caesar's Big Time Wedgie",
    tagline: "Fit for an emperor — or a very hungry lunch break.",
    description:
      'Romaine wedge, bed of spinach, Caesar dressing, grilled chicken, bacon, Parmesan cheese, tomato, red onion, cucumber, croutons, chives, salt & pepper, oregano',
    price: '$11.49',
  },
  {
    name: 'Down Home Wedgie',
    tagline: 'The salad you grew up loving, built bigger.',
    description:
      'Iceberg wedge, fresh cut greens, homemade ranch dressing, grilled chicken, ham, cheddar cheese, tomato, cucumber, peas, broccoli, croutons, chives, salt & pepper, oregano',
    price: '$11.29',
  },
  {
    name: 'The Good Greek Wedgie',
    tagline: 'A gyro in salad form.',
    description:
      'Romaine wedge, bed of spinach, Greek dressing, shaved lamb, feta, tomato, red onion, cucumber, green pepper, Greek olives, pepperoncini pepper, tzatziki sauce',
    price: '$10.19',
  },
  {
    name: 'Green Goddess Wedgie',
    tagline: 'Creamy, crunchy, and loaded with good stuff.',
    description:
      'Romaine wedge, bed of spinach, homemade green goddess dressing, bacon, avocado, hardboiled egg, Parmesan cheese, cherry tomato, red onion, cucumber, broccoli, chives, croutons, salt & pepper, oregano',
    price: '$9.99',
  },
  {
    name: 'Jalapeño Chicken Bacon Wedgie',
    tagline: 'Three layers of jalapeño heat.',
    description:
      'Iceberg wedge, fresh cut greens, ranch dressing, crispy chicken, bacon, hardboiled egg, cheddar cheese, tomato, cucumber, jalapeño ranch dressing, fresh diced jalapeños, crispy fried jalapeños, chives, salt & pepper, oregano',
    price: '$12.99',
  },
  {
    name: 'The Big Dill Wedgie',
    tagline: 'This one\'s kind of a big dill.',
    description:
      'Iceberg wedge, fresh cut greens, homemade ranch dressing, grilled chicken, ham, cheddar, cherry tomato, cucumbers, peas, broccoli, dill aioli dressing, large pickle spear, croutons, chives, salt & pepper, oregano',
    price: '$13.29',
  },
  {
    name: 'Blue Bacon Wedgie',
    tagline: 'The quintessential steakhouse wedge.',
    description:
      'Iceberg wedge, fresh cut greens, blue cheese dressing, bacon, blue cheese crumbles, tomato, red onion, dried cranberries, chives, salt & pepper',
    price: '$8.29',
  },
];

const tossedSalads = [
  {
    name: 'Santa Fe Salad w/ Burnt Ends',
    tagline: 'Protein-packed powerhouse.',
    description:
      'Fresh cut greens, tomatillo lime dressing, burnt ends, cortina cheese, avocado, black beans, corn, tomato, red onions, cilantro, tortilla strips, lime wedge, crispy jalapeños',
    price: '$15.49',
  },
  {
    name: "Elaine's Big Salad",
    tagline: 'Named after our favorite Seinfeld plot.',
    description:
      'Fresh cut greens, choice of dressing, grilled chicken, ham, bacon, avocado, hardboiled egg, cheddar cheese, red onion, tomato, broccoli, cucumber, peas, croutons, chives, salt & pepper, oregano',
    price: '$13.99',
  },
  {
    name: 'Bright Crab Salad',
    tagline: 'A light, zesty take on Maryland crab salad.',
    description:
      'Fresh cut greens, crab salad, red wine vinegar & olive oil dressing, tomatoes, cucumbers, red onions, pepperoncini pepper, kalamata olives, lemon wedge',
    price: '$10.49',
  },
  {
    name: 'Santa Fe Salad w/ Grilled Chicken',
    tagline: 'Bold, fresh, and packed with protein.',
    description:
      'Fresh cut greens, tomatillo lime dressing, grilled chicken, cortina cheese, avocado, black beans, corn, tomato, red onions, cilantro, tortilla strips, lime wedge, crispy jalapeños',
    price: '$11.49',
  },
  {
    name: 'Mango Berry Salad',
    tagline: 'Sweet, juicy, and totally refreshing.',
    description:
      'Fresh cut greens, poppy seed dressing, mangoes, strawberries, blueberries, raspberries, dried cranberries, toasted almonds',
    price: '$9.29',
  },
  {
    name: 'Balsamic Berry Salad',
    tagline: 'Fruity, tangy, and worth every bite.',
    description:
      'Fresh cut greens, homemade balsamic vinaigrette, feta, strawberries, blueberries, raspberries, dried cranberries, sliced almonds',
    price: '$7.99',
  },
  {
    name: 'Garden Salad w/ Ranch',
    tagline: 'A classic done right.',
    description:
      'Fresh cut greens, ranch dressing, cheddar cheese, tomato, cucumber, red onion, croutons, salt & pepper, oregano',
    price: '$6.49',
  },
  {
    name: 'Classic Caesar Salad',
    tagline: 'Simple and satisfying.',
    description: 'Romaine lettuce, Caesar dressing, croutons, Parmesan cheese',
    price: '$5.99',
  },
];

const wedgitos = [
  {
    name: 'Chicken Bacon Avocado Wedgito',
    tagline: 'The fan favorite, in burrito form.',
    description:
      'Fresh cut greens, flour tortilla, ranch dressing, crispy chicken, bacon, cheddar cheese, avocado, hardboiled egg, tomato, cucumber, avocado ranch, croutons, chives, salt & pepper, oregano',
    price: '$12.49',
    image: '/wedgies/wedgito-cba.png',
  },
  {
    name: 'The Good Greek Wedgito',
    tagline: 'Like a gyro in burrito form.',
    description:
      'Fresh cut greens, flour tortilla, Greek dressing, shaved lamb, feta, tomato, red onion, cucumber, green pepper, Greek olives, pepperoncini pepper, tzatziki sauce',
    price: '$9.99',
    image: '/wedgies/wedgito-greek.jpg',
  },
  {
    name: 'Santa Fe Wedgito w/ Burnt Ends',
    tagline: 'Smoky, stacked, and seriously good.',
    description:
      'Fresh cut greens, flour tortilla, tomatillo lime dressing, beef burnt ends, cortina cheese, avocado, black beans, corn, tomato, red onions, cilantro, tortilla strips, lime wedge, crispy jalapeños',
    price: '$15.49',
    image: '/wedgies/wedgito-santa-fe.jpg',
  },
  {
    name: 'Jalapeño Chicken Bacon Wedgito',
    tagline: 'Crispy chicken, bacon, and double jalapeños.',
    description:
      'Fresh cut greens, flour tortilla, homemade ranch dressing, crispy chicken, bacon, hardboiled egg, cheddar cheese, cherry tomato, cucumber, jalapeño ranch dressing, fresh diced jalapeños, crispy fried jalapeños, chives, salt & pepper, oregano',
    price: '$12.99',
    image: null,
  },
  {
    name: "Elaine's Big Wedgito",
    tagline: 'Fully loaded. Oversized. Named after Seinfeld.',
    description:
      'Fresh cut greens, flour tortilla, choice of dressing, grilled chicken, ham, bacon, avocado, hardboiled egg, cheddar cheese, red onion, tomato, broccoli, cucumber, peas, croutons, chives, salt & pepper, oregano',
    price: '$13.99',
    image: null,
  },
  {
    name: 'Down Home Wedgito',
    tagline: 'Comfort food in handheld form.',
    description:
      'Fresh cut greens, flour tortilla, homemade ranch dressing, grilled chicken, ham, cheddar cheese, tomato, cucumber, peas, broccoli, croutons, chives, salt & pepper, oregano',
    price: '$11.29',
    image: null,
  },
];

const eggys = [
  {
    name: 'Ham & Cheese Eggy',
    description: 'Fresh waffled Eggys, ham, pepper jack cheese, mayo, salt & pepper',
    price: null,
  },
  {
    name: 'Bacon, Ham & Cheese Eggy',
    description: 'Fresh waffled Eggys, ham, bacon, pepper jack cheese, mayo, salt & pepper',
    price: null,
  },
  {
    name: 'Atomic Eggy',
    description:
      'Fresh waffled Eggys, ham, bacon, pepper jack cheese, green pepper, red onion, fresh jalapeño, spinach, homemade sriracha mayo',
    price: null,
  },
];

const wacos = [
  {
    name: 'Waco — Ham & Cheese',
    description: 'Flour tortilla, fresh eggs, ham, cheddar cheese, mayo, chives, salt & pepper',
    price: null,
  },
  {
    name: 'Waco — Bacon, Ham & Cheese',
    description:
      'Flour tortilla, fresh eggs, ham, bacon, cheddar cheese, mayo, chives, salt & pepper',
    price: null,
  },
  {
    name: 'Atomic Waco',
    description:
      'Fresh egg, bacon, ham, pepper jack cheese, green onion, fresh jalapeño, green peppers, mayo, sriracha mayo — wrapped in a soft flour tortilla',
    price: null,
  },
];

const parfaits = [
  {
    name: 'Chia Seed Parfait — Strawberry & Blueberry',
    description: '12 oz with chia seed pudding, fresh strawberries, blueberries, and granola',
  },
  {
    name: 'Chia Seed Parfait — Raspberry & Mango',
    description: '12 oz with chia seed pudding, fresh raspberries, mango, and granola',
  },
  {
    name: 'Greek Yogurt Parfait — Strawberry & Blueberry',
    description:
      '12 oz with vanilla, strawberry, and plain greek yogurt, fresh strawberries, blueberries, and granola',
  },
  {
    name: 'Greek Yogurt Parfait — Raspberry & Mango',
    description:
      '12 oz with vanilla and strawberry greek yogurt, fresh raspberries, mango, and granola',
  },
  {
    name: 'Breakfast Banana Split',
    description:
      'A whole banana topped with vanilla and strawberry greek yogurt, fresh strawberries, raspberries, blueberries, almonds, and granola',
  },
];

// ─── Sub-components ────────────────────────────────────

function MenuItem({
  name,
  tagline,
  description,
  price,
}: {
  name: string;
  tagline?: string;
  description: string;
  price?: string | null;
}) {
  return (
    <div className="p-5 bg-white/[0.03] border border-white/10 rounded-xl hover:border-[#c9533c]/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-1">
        <p className="font-semibold text-[#efe5cd]">{name}</p>
        {price && (
          <span className="text-sm font-medium text-[#c9533c] flex-shrink-0">{price}</span>
        )}
      </div>
      {tagline && <p className="text-xs text-[#c9533c]/70 italic mb-1.5">{tagline}</p>}
      <p className="text-sm text-[#efe5cd]/50 leading-relaxed">{description}</p>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-black text-[#efe5cd]">{title}</h3>
      {description && (
        <p className="text-sm text-[#efe5cd]/50 mt-2 max-w-2xl leading-relaxed">{description}</p>
      )}
      <div className="h-px bg-[#c9533c]/20 mt-4" />
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
        <section className="relative overflow-hidden">
          {/* Hero image */}
          <div className="relative h-[420px] md:h-[520px] w-full">
            <Image
              src="/wedgies/wedgie-cba-hero.png"
              alt="Chicken Bacon Avocado Wedgie"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />
            <div className="absolute inset-0 flex items-center px-6">
              <div className="max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-2 text-sm text-[#efe5cd]/40 mb-6">
                  <Link href="/" className="hover:text-[#efe5cd]/70 transition-colors">
                    Olsen Brands
                  </Link>
                  <span>/</span>
                  <span className="text-[#efe5cd]/70">Wedgies</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/logos/wedgies.jpg"
                    alt="Wedgies"
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h1 className="text-5xl md:text-6xl font-black text-[#efe5cd] leading-none">
                      Wedgies
                    </h1>
                    <p className="text-[#c9533c] font-semibold mt-1 text-sm uppercase tracking-wide">
                      Greens, Proteins &amp; Ice Cream
                    </p>
                  </div>
                </div>
                <p className="text-[#efe5cd]/70 text-lg max-w-lg leading-relaxed mb-6">
                  Nobody else does salads like this. Built big, bold, and made fresh to order at our
                  drive-thru in Clinton, UT.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://order.dripos.com/wedgies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9533c] text-white font-bold rounded-lg hover:bg-[#b8432c] transition-colors"
                  >
                    Order Online
                    <ExternalLink size={16} />
                  </a>
                  <div className="flex items-center gap-3 text-sm text-[#efe5cd]/50">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      Clinton, UT
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      Mon–Sat 10AM–8:30PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dole Whip Banner */}
        <section className="px-6 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-xl border border-[#c9533c]/30 bg-[#c9533c]/10 px-6 py-5 flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">🍍</span>
              <div>
                <p className="font-bold text-[#efe5cd]">Wedgies Now Has Dole Whip!</p>
                <p className="text-[#efe5cd]/60 text-sm mt-1">
                  Smooth, pineapple soft-serve that&apos;s dairy-free, vegan, and sweet enough to
                  convince yourself it counts as fruit. Available in-store.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Photos */}
        <section className="px-6 py-6">
          <div className="max-w-5xl mx-auto grid grid-cols-3 gap-3">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image src="/wedgies/salad-santa-fe-burnt-ends.png" alt="Santa Fe with Burnt Ends" fill className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-xs font-semibold text-white">Santa Fe w/ Burnt Ends</p>
              </div>
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image src="/wedgies/salad-bright-crab.png" alt="Bright Crab Salad" fill className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-xs font-semibold text-white">Bright Crab Salad</p>
              </div>
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image src="/wedgies/salad-elaines.png" alt="Elaine's Big Salad" fill className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-xs font-semibold text-white">Elaine&apos;s Big Salad</p>
              </div>
            </div>
          </div>
        </section>

        {/* Full Menu */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-[#efe5cd]">The Menu</h2>
              <a
                href="https://order.dripos.com/wedgies"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#c9533c] text-white font-semibold rounded-lg hover:bg-[#b8432c] transition-colors"
              >
                Order Online <ExternalLink size={14} />
              </a>
            </div>

            {/* Signature Wedgies */}
            <div className="mb-16">
              <SectionHeader
                title="Signature Wedgies"
                description="One-of-a-kind wedge salads — built big, bold, and unlike anything you'll find at typical salad spots. Each one starts with a crisp wedge and finishes with rich, homemade dressings."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {signatureWedgies.map((item) => (
                  <MenuItem key={item.name} {...item} />
                ))}
              </div>
              <div className="relative rounded-xl overflow-hidden h-64">
                <Image
                  src="/wedgies/wedgie-cba.png"
                  alt="Chicken Bacon Avocado Wedgie"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <p className="text-white font-bold text-lg">Chicken Bacon Avocado Wedgie</p>
                    <p className="text-white/60 text-sm">Our most popular. And for good reason.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tossed Salads */}
            <div className="mb-16">
              <SectionHeader
                title="Tossed Salads"
                description="Big, bold, and full of flavor — never boring. From sweet berry salads to crab, burnt ends, and shaved lamb. Made fresh to order, always worth writing home about."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tossedSalads.map((item) => (
                  <MenuItem key={item.name} {...item} />
                ))}
              </div>
            </div>

            {/* Wedgito Burritos */}
            <div className="mb-16">
              <SectionHeader
                title="Wedgito Burritos"
                description='Pronounced "wedg-ee-toh." Any of our fresh salads turned into a handheld, flavor-packed burrito. Full of protein, made to eat on the go — and never any cheap fillers like rice, potatoes, or refried beans.'
              />
              {/* Burrito photos */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  <Image src="/wedgies/wedgito-cba.png" alt="CBA Wedgito" fill className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-xs font-semibold text-white">CBA Wedgito</p>
                  </div>
                </div>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  <Image src="/wedgies/wedgito-greek.jpg" alt="Good Greek Wedgito" fill className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-xs font-semibold text-white">Good Greek Wedgito</p>
                  </div>
                </div>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  <Image src="/wedgies/wedgito-santa-fe.jpg" alt="Santa Fe Wedgito" fill className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-xs font-semibold text-white">Santa Fe Wedgito</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wedgitos.map((item) => (
                  <MenuItem key={item.name} name={item.name} tagline={item.tagline} description={item.description} price={item.price} />
                ))}
              </div>
              <p className="text-xs text-[#efe5cd]/30 mt-4 italic">
                Every salad on the menu is also available as a Wedgito — ask at the window.
              </p>
            </div>

            {/* Wacos & Eggys */}
            <div className="mb-16">
              <SectionHeader
                title="Wacos &amp; Eggys"
                description="All-day breakfast favorites. The Eggy is a no-carb sandwich made with a fresh waffled egg instead of bread. The Waco (pronounced 'Wah-Co') is folded into a flour tortilla and made fresh to order."
              />
              <h4 className="text-sm font-semibold text-[#c9533c] uppercase tracking-wider mb-4">
                No Carb Eggys
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {eggys.map((item) => (
                  <MenuItem key={item.name} name={item.name} description={item.description} />
                ))}
              </div>
              <h4 className="text-sm font-semibold text-[#c9533c] uppercase tracking-wider mb-4">
                Wacos — Pronounced &ldquo;Wah-Co&rdquo;
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wacos.map((item) => (
                  <MenuItem key={item.name} name={item.name} description={item.description} />
                ))}
              </div>
            </div>

            {/* Parfaits */}
            <div className="mb-16">
              <SectionHeader
                title="Fresh Parfaits"
                description="Protein-packed chia seed pudding and greek yogurt parfaits — a nutritious option to kickstart your day or refuel after a workout."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parfaits.map((item) => (
                  <MenuItem key={item.name} name={item.name} description={item.description} />
                ))}
              </div>
            </div>

            {/* Ice Cream & Shakes */}
            <div className="mb-16">
              <SectionHeader
                title="Crazy Good Ice Cream"
                description="Soft-serve from Farr Better Ice Cream, flavored cones, and thick shakes with dozens of flavors. Plus Dole Whip — dairy-free, vegan, and dangerously good."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-5 bg-white/[0.03] border border-white/10 rounded-xl hover:border-[#c9533c]/30 transition-colors">
                  <p className="font-semibold text-[#efe5cd] mb-1">Flavored Cones</p>
                  <p className="text-sm text-[#efe5cd]/50">
                    Dozens of flavors, from classic vanilla to Orange Dreamsicle. In-store only.
                  </p>
                </div>
                <div className="p-5 bg-white/[0.03] border border-white/10 rounded-xl hover:border-[#c9533c]/30 transition-colors">
                  <p className="font-semibold text-[#efe5cd] mb-1">Thick Shakes</p>
                  <p className="text-sm text-[#efe5cd]/50">
                    Loaded, blended, and made to order. In-store only.
                  </p>
                </div>
                <div className="p-5 bg-white/[0.03] border border-[#c9533c]/30 bg-[#c9533c]/5 rounded-xl">
                  <p className="font-semibold text-[#efe5cd] mb-1">🍍 Dole Whip</p>
                  <p className="text-sm text-[#efe5cd]/50">
                    Pineapple soft-serve. Dairy-free, vegan, and basically just fruit. In-store only.
                  </p>
                </div>
              </div>
              {/* Shake photos */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image src="/wedgies/shake-banana.png" alt="Banana Thick Shake" fill className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-xs font-semibold text-white">Banana Thick Shake</p>
                  </div>
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image src="/wedgies/shake-reeses.png" alt="Reese's Thick Shake" fill className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-xs font-semibold text-white">Reese&apos;s Thick Shake</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order CTA */}
        <section className="py-12 px-6 bg-[#c9533c]/5 border-y border-[#c9533c]/20">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-2xl font-black text-[#efe5cd]">Ready to build your Wedgie?</p>
              <p className="text-[#efe5cd]/50 text-sm mt-1">
                Order ahead for pickup — or just pull through the drive-thru.
              </p>
            </div>
            <a
              href="https://order.dripos.com/wedgies"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9533c] text-white font-bold text-lg rounded-xl hover:bg-[#b8432c] transition-colors flex-shrink-0"
            >
              Order Online <ExternalLink size={18} />
            </a>
          </div>
        </section>

        {/* Hours + Address */}
        <section className="py-10 px-6">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-5 bg-white/[0.03] border border-white/10 rounded-xl">
              <Clock size={20} className="text-[#c9533c] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#efe5cd]/40 uppercase tracking-wider mb-1">Winter Hours</p>
                <p className="text-[#efe5cd] font-semibold">Mon – Sat · 10:00 AM – 8:30 PM</p>
                <p className="text-[#efe5cd]/50 text-sm">Sunday closed</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-5 bg-white/[0.03] border border-white/10 rounded-xl">
              <MapPin size={20} className="text-[#c9533c] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#efe5cd]/40 uppercase tracking-wider mb-1">Location</p>
                <p className="text-[#efe5cd] font-semibold">2212 W 1800 N Ste. B</p>
                <p className="text-[#efe5cd]/50 text-sm">Clinton, UT</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team link */}
        <section className="pb-12 px-6 border-t border-white/[0.06] pt-10">
          <div className="max-w-5xl mx-auto">
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
    'Fresh wedge salads, Wedgito burritos, no-carb Eggys, Wacos, parfaits, and crazy good ice cream — made fresh to order at our Clinton, UT drive-thru.',
};
