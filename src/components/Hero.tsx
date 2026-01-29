"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#141413] to-[#0f0f0f]" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#efe5cd 1px, transparent 1px), linear-gradient(90deg, #efe5cd 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a28] bg-[#1a1918]/50 mb-8">
            <Rocket className="w-4 h-4 text-[#c9533c]" />
            <span className="text-sm text-[#efe5cd]/70">
              Building the future of local business
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-[#efe5cd]">SOFTWARE.</span>
            <br />
            <span className="text-[#efe5cd]">RESTAURANTS.</span>
            <br />
            <span className="text-[#c9533c]">COMMUNITY.</span>
          </h1>

          <p className="text-xl md:text-2xl text-[#efe5cd]/60 max-w-3xl mx-auto mb-12 leading-relaxed">
            Olsen Brands Management builds technology that solves real problems
            and operates businesses that serve real communities across Utah.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#ventures"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#c9533c] text-[#efe5cd] font-semibold rounded-lg hover:bg-[#b8482f] transition-colors"
            >
              Explore Our Ventures
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/story"
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#2a2a28] text-[#efe5cd] font-semibold rounded-lg hover:bg-[#1a1918] transition-colors"
            >
              Our Story
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-[#2a2a28]"
        >
          {[
            { value: "7", label: "Active Businesses" },
            { value: "3", label: "Software Products" },
            { value: "50+", label: "Team Members" },
            { value: "Utah", label: "Based & Growing" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold text-[#c9533c]">
                {stat.value}
              </div>
              <div className="text-sm text-[#efe5cd]/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
