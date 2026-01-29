"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-[#080808] border-t border-[#1a1918]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#c9533c] rounded-lg flex items-center justify-center">
                <span className="text-[#efe5cd] font-bold text-lg">OB</span>
              </div>
              <div>
                <span className="text-[#efe5cd] font-bold tracking-tight">
                  OLSEN
                </span>
                <span className="text-[#c9533c] font-bold tracking-tight ml-1">
                  BRANDS
                </span>
              </div>
            </div>
            <p className="text-[#efe5cd]/50 text-sm leading-relaxed">
              Software, restaurants, and community. Building the future of local
              business from Utah.
            </p>
          </div>

          <div>
            <h4 className="text-[#efe5cd] font-semibold mb-4">Software</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/ventures/shiftcheck"
                  className="text-[#efe5cd]/50 hover:text-[#efe5cd] transition-colors text-sm"
                >
                  ShiftCheck
                </Link>
              </li>
              <li>
                <Link
                  href="/ventures/tonicbase"
                  className="text-[#efe5cd]/50 hover:text-[#efe5cd] transition-colors text-sm"
                >
                  TonicBase
                </Link>
              </li>
              <li>
                <Link
                  href="/ventures/clinton-comeback"
                  className="text-[#efe5cd]/50 hover:text-[#efe5cd] transition-colors text-sm"
                >
                  Clinton Comeback
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#efe5cd] font-semibold mb-4">Brands</h4>
            <ul className="space-y-3">
              {["Wedgie\u2019s", "FiiZ Drinks", "Subway", "On Chord Academy"].map(
                (brand) => (
                  <li key={brand}>
                    <span className="text-[#efe5cd]/50 text-sm">{brand}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-[#efe5cd] font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/story"
                  className="text-[#efe5cd]/50 hover:text-[#efe5cd] transition-colors text-sm"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <a
                  href="https://shiftcheck.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#efe5cd]/50 hover:text-[#efe5cd] transition-colors text-sm inline-flex items-center gap-1"
                >
                  ShiftCheck App{" "}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://clintoncomeback.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#efe5cd]/50 hover:text-[#efe5cd] transition-colors text-sm inline-flex items-center gap-1"
                >
                  Clinton Comeback{" "}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1a1918] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#efe5cd]/40 text-sm">
            &copy; {new Date().getFullYear()} Olsen Brands Management. All
            rights reserved.
          </p>
          <p className="text-[#efe5cd]/40 text-sm">
            Built in Utah &#127956;&#65039;
          </p>
        </div>
      </div>
    </footer>
  );
}
