"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Trophy,
  Store,
  Users,
  Calendar,
  ExternalLink,
  MapPin,
} from "lucide-react";

export function ClintonComebackContent() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4a7c9b]/30 bg-[#4a7c9b]/10 mb-6">
              <Heart className="w-4 h-4 text-[#4a7c9b]" />
              <span className="text-sm text-[#4a7c9b] font-medium">
                Civic Engagement Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-[#efe5cd]">SHOP LOCAL.</span>
              <br />
              <span className="text-[#efe5cd]">WIN BIG.</span>
              <br />
              <span className="text-[#4a7c9b]">SAVE YOUR TOWN.</span>
            </h1>

            <p className="text-xl text-[#efe5cd]/60 max-w-3xl mb-8 leading-relaxed">
              Clinton Comeback is a gamified shop-local competition that turns
              everyday purchases into community pride. Neighborhoods compete,
              local businesses win, and small-town Utah gets the love it
              deserves.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://clintoncomeback.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-[#4a7c9b] text-[#efe5cd] font-semibold rounded-lg hover:bg-[#3d6b87] transition-colors"
              >
                Visit ClintonComeback.com
                <ExternalLink className="w-5 h-5" />
              </a>
              <div className="inline-flex items-center gap-2 px-6 py-4 border border-[#2a2a28] text-[#efe5cd]/70 font-semibold rounded-lg">
                <Calendar className="w-5 h-5" />
                Launches February 8, 2026
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#4a7c9b] text-sm font-semibold tracking-wider uppercase">
              The Story
            </span>
            <h2 className="text-4xl font-bold text-[#efe5cd] mt-4 mb-8">
              Small Towns Deserve Big Energy
            </h2>
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-4 text-[#efe5cd]/60 leading-relaxed">
                <p>
                  Clinton, Utah. Population ~23,000. A community where people
                  know each other&apos;s names, kids play in the same parks, and
                  local businesses are the heartbeat of the neighborhood.
                </p>
                <p>
                  But small towns face a challenge:{" "}
                  <span className="text-[#efe5cd] font-semibold">
                    how do you keep people shopping local when Amazon delivers
                    tomorrow?
                  </span>
                </p>
                <p>
                  Clinton Comeback answers that question with competition,
                  community pride, and prizes. When shopping at your
                  neighbor&apos;s store becomes a game your whole neighborhood is
                  playing, everyone wins.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: "Neighborhood Brackets",
                    desc: "Residents are grouped by neighborhood. Each area competes for the most local purchases.",
                  },
                  {
                    icon: Trophy,
                    title: "Leaderboard & Prizes",
                    desc: "Real-time standings, weekly awards, and grand prizes for the most engaged neighborhoods.",
                  },
                  {
                    icon: Store,
                    title: "Local Business Partners",
                    desc: "Participating businesses offer exclusive deals. Receipts or check-ins earn points.",
                  },
                  {
                    icon: Users,
                    title: "Community Events",
                    desc: "Pop-up markets, neighborhood rallies, and celebration events throughout the competition.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#4a7c9b]/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#4a7c9b]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#efe5cd] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-[#efe5cd]/50">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#4a7c9b] text-sm font-semibold tracking-wider uppercase">
              Why It Matters
            </span>
            <h2 className="text-4xl font-bold text-[#efe5cd] mt-4 mb-8">
              This Isn&apos;t Just an App. It&apos;s a Movement.
            </h2>
            <p className="text-lg text-[#efe5cd]/60 leading-relaxed mb-8">
              When you gamify community engagement, something remarkable happens.
              People start talking to their neighbors again. They discover
              businesses they didn&apos;t know existed. They feel proud of where they
              live.
            </p>
            <p className="text-lg text-[#efe5cd]/60 leading-relaxed mb-12">
              Clinton Comeback starts in Clinton, UT — because that&apos;s where we
              live and work. But the platform is designed to scale to any
              community that wants to bring its people together.
            </p>
            <a
              href="https://clintoncomeback.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#4a7c9b] text-[#efe5cd] font-semibold rounded-lg hover:bg-[#3d6b87] transition-colors"
            >
              Join the Comeback
              <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
