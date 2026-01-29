"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Wrench, Eye, TrendingUp } from "lucide-react";

const principles = [
  {
    icon: Target,
    title: "Build What You Know",
    description:
      "We only build software for industries where we operate daily. ShiftCheck exists because we run restaurants. TonicBase exists because we run a music school. No guessing — just solving.",
  },
  {
    icon: Wrench,
    title: "Fix What\u2019s Broken",
    description:
      "Most business software is built by engineers who\u2019ve never worked a shift, never balanced a register, never dealt with a no-show student. We have. That\u2019s the difference.",
  },
  {
    icon: Eye,
    title: "Accountability Over Automation",
    description:
      "We don\u2019t believe in replacing people with machines. We believe in giving people tools that make their work visible, valued, and verifiable.",
  },
  {
    icon: TrendingUp,
    title: "Grow Roots, Not Footprint",
    description:
      "We\u2019re not chasing vanity metrics or raising rounds. We\u2019re building sustainable businesses in communities we care about. Utah first. Then we\u2019ll see.",
  },
];

export function Philosophy() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#c9533c] text-sm font-semibold tracking-wider uppercase">
            How We Think
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#efe5cd] mt-4 mb-6">
            Our Operating Philosophy
          </h2>
          <p className="text-[#efe5cd]/60 text-lg max-w-2xl mx-auto">
            We didn&apos;t start as a tech company. We started as operators who got
            tired of bad tools.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 p-6 bg-[#1a1918] border border-[#2a2a28] rounded-xl"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#c9533c]/10 flex items-center justify-center">
                <p.icon className="w-6 h-6 text-[#c9533c]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#efe5cd] mb-2">
                  {p.title}
                </h3>
                <p className="text-[#efe5cd]/50 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
