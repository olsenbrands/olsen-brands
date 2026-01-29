"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code,
  Music,
  Heart,
  Salad,
  Coffee,
  Sandwich,
  GraduationCap,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const software = [
  {
    name: "ShiftCheck",
    tagline: "Restaurant Accountability Platform",
    description:
      "Photo-verified checklists that prove work gets done every shift, every day, across every location. No more paper checklists that lie.",
    icon: Code,
    color: "#c9533c",
    href: "/ventures/shiftcheck",
    status: "Live",
  },
  {
    name: "TonicBase",
    tagline: "Music School Management",
    description:
      "Modern scheduling, billing, and student management built by people who actually run a music school.",
    icon: Music,
    color: "#5b8c5a",
    href: "/ventures/tonicbase",
    status: "Coming Soon",
  },
  {
    name: "Clinton Comeback",
    tagline: "Civic Engagement Platform",
    description:
      "A gamified shop-local competition bringing communities back together. Because small towns deserve big energy.",
    icon: Heart,
    color: "#4a7c9b",
    href: "/ventures/clinton-comeback",
    status: "Feb 2026",
  },
];

const physical = [
  {
    name: "Wedgie\u2019s",
    tagline: "Gourmet Wedge Salads",
    description:
      "Greens, proteins, and ice cream. Drive-thru healthy fast food done right.",
    icon: Salad,
    color: "#7cb342",
    locations: "1 location \u2022 Clinton, UT",
    featured: true,
  },
  {
    name: "FiiZ Drinks",
    tagline: "Premium Soda & Treats",
    description:
      "Custom sodas, cookies, and good vibes. Franchise locations across Utah.",
    icon: Coffee,
    color: "#e91e63",
    locations: "3 locations",
  },
  {
    name: "Subway",
    tagline: "Sandwich Franchise",
    description:
      "Classic submarine sandwiches. Franchise operations in Davis & Morgan counties.",
    icon: Sandwich,
    color: "#4caf50",
    locations: "3 locations",
  },
  {
    name: "On Chord Academy",
    tagline: "Music Education",
    description:
      "Guitar, piano, drums, and more. Building musicians since 2013.",
    icon: GraduationCap,
    color: "#ff9800",
    locations: "Layton, UT",
  },
];

export function VenturesGrid() {
  return (
    <section id="ventures" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#c9533c] text-sm font-semibold tracking-wider uppercase">
            Our Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#efe5cd] mt-4 mb-6">
            Software &amp; Storefronts
          </h2>
          <p className="text-[#efe5cd]/60 text-lg max-w-2xl mx-auto">
            We build technology where we have deep domain expertise — because we
            run the businesses that use it.
          </p>
        </motion.div>

        {/* Software Products */}
        <div id="software" className="mb-16">
          <h3 className="text-xl font-semibold text-[#efe5cd]/80 mb-8 flex items-center gap-3">
            <Code className="w-5 h-5 text-[#c9533c]" />
            Software Products
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {software.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={v.href}
                  className="group block bg-[#1a1918] border border-[#2a2a28] rounded-xl p-6 hover:border-[#3a3a38] transition-colors h-full"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${v.color}20` }}
                  >
                    <v.icon className="w-6 h-6" style={{ color: v.color }} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold text-[#efe5cd]">
                      {v.name}
                    </h4>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${v.color}20`,
                        color: v.color,
                      }}
                    >
                      {v.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#c9533c] mb-3">{v.tagline}</p>
                  <p className="text-[#efe5cd]/50 text-sm mb-4">
                    {v.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-[#efe5cd]/70 group-hover:text-[#efe5cd] transition-colors">
                    Learn more{" "}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Physical Brands */}
        <div>
          <h3 className="text-xl font-semibold text-[#efe5cd]/80 mb-8 flex items-center gap-3">
            <Salad className="w-5 h-5 text-[#c9533c]" />
            Restaurants &amp; Services
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {physical.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-[#1a1918] border rounded-xl p-6 transition-colors ${
                  v.featured
                    ? "border-[#c9533c]/50 hover:border-[#c9533c]"
                    : "border-[#2a2a28] hover:border-[#3a3a38]"
                }`}
              >
                {v.featured && (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-[#c9533c] text-[#efe5cd] text-xs font-semibold rounded-full">
                    The Dream
                  </div>
                )}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${v.color}20` }}
                >
                  <v.icon className="w-6 h-6" style={{ color: v.color }} />
                </div>
                <h4 className="text-xl font-bold text-[#efe5cd] mb-1">
                  {v.name}
                </h4>
                <p className="text-sm text-[#c9533c] mb-3">{v.tagline}</p>
                <p className="text-[#efe5cd]/50 text-sm mb-3">
                  {v.description}
                </p>
                <p className="text-xs text-[#efe5cd]/40">{v.locations}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vision callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-[#c9533c]/10 to-transparent border border-[#c9533c]/20 rounded-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-[#efe5cd] mb-2">
                The Vision: 10 Wedgie&apos;s Across Utah
              </h3>
              <p className="text-[#efe5cd]/60">
                The franchises fund the dream. Wedgie&apos;s is the destination.
              </p>
            </div>
            <Link
              href="/story"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9533c] text-[#efe5cd] font-semibold rounded-lg hover:bg-[#b8482f] transition-colors whitespace-nowrap"
            >
              Read Our Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
