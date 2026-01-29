"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Guitar, Users, Heart, Lightbulb, ArrowRight } from "lucide-react";

const timeline = [
  { year: "1994", title: "First Guitar", description: "Jordan picks up a guitar at 14. His parents were musicians, his grandparents owned a theater. Music is in the blood." },
  { year: "1998-2009", title: "The Band Years", description: "Ashburn Roads. Mr. Brownstone. Old Man Johnson. Gorgeous Hussies (record label, toured Western US). Wailing O\u2019Shea\u2019s (Irish punk). Jordan learns that passion and business aren\u2019t opposites." },
  { year: "2005", title: "Jordan & Jennifer", description: "Marriage. Family starts growing. Three daughters: Ayla, Lily, and Hadley. The late-night gigs evolve into early-morning business plans." },
  { year: "2013", title: "On Chord Academy Opens", description: "Jordan and John Chatlyn (Gorgeous Hussies bandmate) open a music school in Layton. Teaching the next generation while learning to run a business." },
  { year: "2015-2020", title: "Franchise Growth", description: "Three Subways. Three FiiZ Drinks. Learning every aspect of restaurant operations from the inside \u2014 the good, the bad, and the paper checklists." },
  { year: "2023", title: "Wedgie\u2019s is Born", description: "Gourmet wedge salads with a drive-thru twist. The first brand Jordan & Jennifer own outright. Not a franchise. Their baby. Greens, proteins, and ice cream." },
  { year: "Oct 2025", title: "Vibe Coding Era", description: "Jordan discovers the power of building software himself. ShiftCheck goes from idea to prototype. The software philosophy crystallizes: build for the industries you live in." },
  { year: "Jan 2026", title: "Clinton Comeback Launches", description: "A gamified shop-local platform for Clinton, UT. Community engagement meets competition. The first non-restaurant software venture." },
  { year: "2026+", title: "The Vision", description: "10 Wedgie\u2019s across Utah. ShiftCheck in restaurants nationwide. TonicBase in music schools everywhere. Software and storefronts, feeding each other." },
];

export function StoryContent() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#c9533c] text-sm font-semibold tracking-wider uppercase">
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-4 mb-6">
              <span className="text-[#efe5cd]">FROM GARAGE BANDS</span>
              <br />
              <span className="text-[#c9533c]">TO BUSINESS BRANDS.</span>
            </h1>
            <p className="text-xl text-[#efe5cd]/60 max-w-3xl leading-relaxed">
              Olsen Brands Management didn&apos;t start with a business plan. It
              started with a guitar, a work ethic, and the belief that if
              something&apos;s broken, you build something better.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6 text-[#efe5cd]/70 leading-relaxed">
                <p className="text-lg">
                  <span className="text-[#efe5cd] font-semibold">
                    Jordan Olsen
                  </span>{" "}
                  grew up surrounded by music. Parents who played. Grandparents
                  who owned a theater. He picked up a guitar at 14 and never put
                  it down.
                </p>
                <p>
                  Through high school, college, and beyond, he played in bands
                  that ranged from alt-rock to Irish punk. Gorgeous Hussies got
                  signed to a record label. Wailing O&apos;Shea&apos;s toured the
                  Western US. The music was real, and so was the hustle.
                </p>
                <p>
                  But when he and{" "}
                  <span className="text-[#efe5cd] font-semibold">Jennifer</span>{" "}
                  started their family, the game changed. Three daughters. A
                  mortgage. The kind of life that needs more than gig money.
                </p>
                <p>
                  So Jordan did what musicians do:{" "}
                  <span className="text-[#efe5cd] font-semibold">
                    he improvised.
                  </span>
                </p>
                <p>
                  He and his bandmate John Chatlyn opened{" "}
                  <span className="text-[#efe5cd]">On Chord Academy</span> — a
                  music school in Layton. Then came the Subway franchises. Then
                  FiiZ Drinks. Then{" "}
                  <span className="text-[#c9533c] font-semibold">
                    Wedgie&apos;s
                  </span>{" "}
                  — the first brand they owned outright. Not a franchise.
                  <em> Their</em> thing.
                </p>
                <p className="text-lg text-[#efe5cd]">
                  And then came the software.
                </p>
                <p>
                  After years of running restaurants and a music school, Jordan
                  realized something: the tools these businesses depended on were
                  terrible. Built by engineers who&apos;d never worked a closing
                  shift or dealt with a student no-show.
                </p>
                <p className="text-lg text-[#c9533c] font-semibold">
                  If nobody was going to build what we needed, we&apos;d build it
                  ourselves.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Guitar, title: "Musician\u2019s Soul", desc: "Creativity meets discipline. Stage presence meets preparation. Every business is a performance." },
                  { icon: Users, title: "Family First", desc: "Jennifer, Ayla, Lily, Hadley. Faith. Community. Everything we build serves a bigger purpose." },
                  { icon: Lightbulb, title: "Builder\u2019s Mind", desc: "If the tool doesn\u2019t exist, create it. Don\u2019t wait for permission. Start building." },
                  { icon: Heart, title: "Utah Roots", desc: "Clinton. Kaysville. Layton. Ogden. Morgan. We build businesses that serve our neighbors." },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="bg-[#1a1918] border border-[#2a2a28] rounded-xl p-5"
                  >
                    <card.icon className="w-8 h-8 text-[#c9533c] mb-3" />
                    <h4 className="font-semibold text-[#efe5cd] mb-1">
                      {card.title}
                    </h4>
                    <p className="text-sm text-[#efe5cd]/50">{card.desc}</p>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="bg-[#c9533c]/10 border border-[#c9533c]/20 rounded-xl p-6">
                <blockquote className="text-[#efe5cd] text-lg italic leading-relaxed">
                  &ldquo;We&apos;re not a tech company that dabbles in restaurants.
                  We&apos;re operators who got tired of bad tools and decided to
                  build better ones.&rdquo;
                </blockquote>
                <p className="text-[#c9533c] font-semibold mt-4">
                  — Jordan Olsen, Founder
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#c9533c] text-sm font-semibold tracking-wider uppercase">
              The Journey
            </span>
            <h2 className="text-4xl font-bold text-[#efe5cd] mt-4">
              30 Years in the Making
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[#2a2a28]" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative pl-20"
                >
                  <div className="absolute left-5 w-6 h-6 bg-[#c9533c] rounded-full border-4 border-[#0f0f0f]" />
                  <span className="text-[#c9533c] font-bold text-sm">
                    {item.year}
                  </span>
                  <h4 className="text-xl font-semibold text-[#efe5cd] mt-1 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-[#efe5cd]/50 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#c9533c]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#efe5cd] mb-6">
            We&apos;re Just Getting Started.
          </h2>
          <p className="text-xl text-[#efe5cd]/80 mb-8">
            Explore the ventures we&apos;re building and see where we&apos;re headed.
          </p>
          <Link
            href="/#ventures"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#efe5cd] text-[#0f0f0f] font-bold rounded-lg hover:bg-[#efe5cd]/90 transition-colors"
          >
            Explore Our Ventures
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
