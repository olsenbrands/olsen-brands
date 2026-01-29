"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Music,
  Calendar,
  CreditCard,
  Users,
  Bell,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Teacher availability, student preferences, room assignments — all in one view. No more spreadsheet juggling.",
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    description:
      "Automated tuition billing, payment tracking, and late-payment reminders. Get paid on time, every time.",
  },
  {
    icon: Users,
    title: "Student Profiles",
    description:
      "Track lesson history, progress notes, repertoire, and parent contacts. Every teacher sees the full picture.",
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    description:
      "Lesson reminders, schedule changes, and makeup notifications. Reduce no-shows without lifting a finger.",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description:
      "Enrollment trends, retention rates, teacher utilization. Know your numbers without counting heads.",
  },
  {
    icon: Music,
    title: "Recital Management",
    description:
      "Organize performances, assign time slots, manage programs. From signup to standing ovation.",
  },
];

export function TonicBaseContent() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#5b8c5a]/30 bg-[#5b8c5a]/10 mb-6">
              <Music className="w-4 h-4 text-[#5b8c5a]" />
              <span className="text-sm text-[#5b8c5a] font-medium">
                Music School Management — Coming Soon
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-[#efe5cd]">YOUR MUSIC SCHOOL.</span>
              <br />
              <span className="text-[#5b8c5a]">FINALLY IN TUNE.</span>
            </h1>

            <p className="text-xl text-[#efe5cd]/60 max-w-3xl mb-8 leading-relaxed">
              TonicBase is music school management software built by people who
              actually run a music school. Scheduling, billing, student
              tracking, and analytics — designed for how music education actually
              works.
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-3 border border-[#5b8c5a]/30 text-[#5b8c5a] font-semibold rounded-lg">
              Coming 2026
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why We Built It */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <span className="text-[#5b8c5a] text-sm font-semibold tracking-wider uppercase">
                Why TonicBase Exists
              </span>
              <h2 className="text-4xl font-bold text-[#efe5cd] mt-4 mb-6">
                We Tried Every Music School App. They All Missed the Note.
              </h2>
              <div className="space-y-4 text-[#efe5cd]/60 leading-relaxed">
                <p>
                  Jordan Olsen and John Chatlyn have run{" "}
                  <span className="text-[#efe5cd] font-semibold">
                    On Chord Academy
                  </span>{" "}
                  since 2013. Six teachers. 150+ students. Layton, Utah.
                </p>
                <p>
                  They&apos;ve used every music school management tool on the market.
                  Generic CRMs shoe-horned into music. Scheduling apps that
                  don&apos;t understand recurring lessons. Billing systems that
                  can&apos;t handle a makeup policy.
                </p>
                <p>
                  <span className="text-[#5b8c5a] font-semibold">
                    So they&apos;re building their own.
                  </span>{" "}
                  TonicBase is designed from day one for the specific workflows
                  of music education — not retrofitted from a gym booking app.
                </p>
              </div>
            </div>

            <div className="bg-[#1a1918] border border-[#2a2a28] rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#efe5cd] mb-6">
                On Chord Academy
              </h3>
              <div className="space-y-4 text-[#efe5cd]/60">
                <div className="flex justify-between border-b border-[#2a2a28] pb-3">
                  <span>Founded</span>
                  <span className="text-[#efe5cd]">2013</span>
                </div>
                <div className="flex justify-between border-b border-[#2a2a28] pb-3">
                  <span>Location</span>
                  <span className="text-[#efe5cd]">Layton, UT</span>
                </div>
                <div className="flex justify-between border-b border-[#2a2a28] pb-3">
                  <span>Teachers</span>
                  <span className="text-[#efe5cd]">~6</span>
                </div>
                <div className="flex justify-between border-b border-[#2a2a28] pb-3">
                  <span>Students</span>
                  <span className="text-[#efe5cd]">150-160</span>
                </div>
                <div className="flex justify-between">
                  <span>Instruments</span>
                  <span className="text-[#efe5cd]">
                    Guitar, Piano, Drums, Voice, Bass
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#5b8c5a] text-sm font-semibold tracking-wider uppercase">
              What&apos;s Coming
            </span>
            <h2 className="text-4xl font-bold text-[#efe5cd] mt-4">
              Built for Music. Not Retrofitted.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#1a1918] border border-[#2a2a28] rounded-xl p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-[#5b8c5a]/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-[#5b8c5a]" />
                </div>
                <h4 className="text-lg font-bold text-[#efe5cd] mb-2">
                  {f.title}
                </h4>
                <p className="text-[#efe5cd]/50 text-sm leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
