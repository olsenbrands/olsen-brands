"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Camera,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Clock,
  Shield,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Photo-Verified Tasks",
    description:
      "No more checkboxes that lie. Every task requires a photo proving it was actually completed. Visual proof, not verbal promises.",
  },
  {
    icon: AlertTriangle,
    title: "Failed Items Loop Back",
    description:
      "When a manager marks a task as failed, it goes right back to the device for completion. No task falls through the cracks.",
  },
  {
    icon: BarChart3,
    title: "Employee KPIs",
    description:
      "Track individual pass/fail rates, who gets marked exceptional, and which shift leads submit on time. Data-driven accountability.",
  },
  {
    icon: Clock,
    title: "Auto-Escalation",
    description:
      "Late checklist? Auto-texts the manager. Missed shift? Flagged immediately. The system never sleeps, even when your closers want to.",
  },
  {
    icon: Shield,
    title: "Shift Lead Submissions",
    description:
      "One shared device per store. Shift lead submits the batch. Manager reviews from anywhere. Simple chain of accountability.",
  },
  {
    icon: CheckCircle,
    title: "Pass, Fail, or Exceptional",
    description:
      "Three-tier review system. Celebrate excellence, flag problems, and build a performance record that actually means something.",
  },
];

export function ShiftCheckContent() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c9533c]/30 bg-[#c9533c]/10 mb-6">
              <Camera className="w-4 h-4 text-[#c9533c]" />
              <span className="text-sm text-[#c9533c] font-medium">
                Restaurant Accountability Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-[#efe5cd]">SEE EVERY SHIFT.</span>
              <br />
              <span className="text-[#c9533c]">TRUST EVERY CHECKLIST.</span>
            </h1>

            <p className="text-xl text-[#efe5cd]/60 max-w-3xl mb-8 leading-relaxed">
              ShiftCheck replaces paper checklists with photo-verified task
              management. Your managers get an eyewitness view of every shift,
              every day, across all locations — without being there.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://shiftcheck.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-[#c9533c] text-[#efe5cd] font-semibold rounded-lg hover:bg-[#b8482f] transition-colors"
              >
                Visit ShiftCheck.app
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <span className="text-[#c9533c] text-sm font-semibold tracking-wider uppercase">
                The Problem
              </span>
              <h2 className="text-4xl font-bold text-[#efe5cd] mt-4 mb-6">
                Paper Checklists Are a Lie
              </h2>
              <div className="space-y-4 text-[#efe5cd]/60 leading-relaxed">
                <p>
                  Every restaurant has checklists. Opening duties. Closing
                  duties. Temperature logs. Cleaning schedules. And every
                  restaurant owner knows the dirty secret:{" "}
                  <span className="text-[#efe5cd] font-semibold">
                    employees learn which tasks they can skip.
                  </span>
                </p>
                <p>
                  A paper checklist is just a list of checkboxes. Anyone can
                  check a box. Nobody verifies. Work gets pushed from shift to
                  shift — openers blame closers, closers blame openers, and the
                  cycle continues.
                </p>
                <p>
                  Regional managers can physically visit 1-2 stores per day. If
                  you own 10 locations, that means 80% of your shifts are
                  unsupervised on any given day.
                </p>
              </div>
            </div>

            <div className="bg-[#1a1918] border border-[#2a2a28] rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#efe5cd] mb-6">
                The Real Cost of Zero Accountability
              </h3>
              <div className="space-y-4">
                {[
                  "Health code violations from skipped cleaning tasks",
                  "Customer complaints from inconsistent food prep",
                  "Employee resentment — good workers carry lazy ones",
                  "Manager burnout from constant fire-fighting",
                  "Revenue loss from preventable operational failures",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#c9533c] flex-shrink-0 mt-0.5" />
                    <p className="text-[#efe5cd]/70 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#c9533c] text-sm font-semibold tracking-wider uppercase">
              How It Works
            </span>
            <h2 className="text-4xl font-bold text-[#efe5cd] mt-4">
              Five Steps to Full Visibility
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                step: "01",
                title: "Shared Device",
                desc: "One tablet or phone at each store. No apps to download. No logins to remember.",
              },
              {
                step: "02",
                title: "Shift Checklist",
                desc: "Tasks pop up for each shift and day part. Customized to your operation.",
              },
              {
                step: "03",
                title: "Photo Proof",
                desc: "Employees snap photos of completed tasks. Not checkboxes — evidence.",
              },
              {
                step: "04",
                title: "Lead Submits",
                desc: "Shift lead reviews and submits the batch. Ownership at every level.",
              },
              {
                step: "05",
                title: "Manager Reviews",
                desc: "Pass, fail, or exceptional. Failed items loop back for completion.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-[#c9533c] mb-3">
                  {item.step}
                </div>
                <h4 className="font-semibold text-[#efe5cd] mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-[#efe5cd]/50">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#c9533c] text-sm font-semibold tracking-wider uppercase">
              Features
            </span>
            <h2 className="text-4xl font-bold text-[#efe5cd] mt-4">
              Built for Real Restaurant Operators
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
                <div className="w-12 h-12 rounded-lg bg-[#c9533c]/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-[#c9533c]" />
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

      {/* CTA */}
      <section className="py-24 px-6 bg-[#c9533c]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#efe5cd] mb-6">
            Stop Guessing.<br />Start Seeing.
          </h2>
          <p className="text-xl text-[#efe5cd]/80 mb-8 max-w-2xl mx-auto">
            ShiftCheck gives restaurant owners an eyewitness view of every
            shift, every day, across all locations.
          </p>
          <a
            href="https://shiftcheck.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#efe5cd] text-[#0f0f0f] font-bold rounded-lg hover:bg-[#efe5cd]/90 transition-colors"
          >
            Get Started at ShiftCheck.app
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </section>
    </main>
  );
}
