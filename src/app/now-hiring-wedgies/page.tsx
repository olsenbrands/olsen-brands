'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Upload, CheckCircle, Loader2 } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

type WorkEntry = {
  location: string;
  startDate: string;
  endDate: string;
  duties: string;
};

type Availability = Record<string, { start: string; end: string } | null>;

export default function NowHiringWedgiesPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [whyWorkHere, setWhyWorkHere] = useState('');
  const [workExperience, setWorkExperience] = useState<WorkEntry[]>([
    { location: '', startDate: '', endDate: '', duties: '' },
  ]);
  const [availability, setAvailability] = useState<Availability>({});
  const [resume, setResume] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addWorkEntry = () => {
    setWorkExperience([...workExperience, { location: '', startDate: '', endDate: '', duties: '' }]);
  };

  const removeWorkEntry = (index: number) => {
    if (workExperience.length > 1) {
      setWorkExperience(workExperience.filter((_, i) => i !== index));
    }
  };

  const updateWorkEntry = (index: number, field: keyof WorkEntry, value: string) => {
    const updated = [...workExperience];
    updated[index] = { ...updated[index], [field]: value };
    setWorkExperience(updated);
  };

  const toggleDay = (day: string) => {
    setAvailability((prev) => {
      if (prev[day]) {
        const next = { ...prev };
        delete next[day];
        return next;
      }
      return { ...prev, [day]: { start: '10:00', end: '20:00' } };
    });
  };

  const updateDayTime = (day: string, field: 'start' | 'end', value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day]!, [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('age_range', ageRange);
      formData.append('why_work_here', whyWorkHere);
      formData.append(
        'work_experience',
        JSON.stringify(workExperience.filter((w) => w.location.trim()))
      );
      formData.append('availability', JSON.stringify(availability));
      if (resume) {
        formData.append('resume', resume);
      }

      const res = await fetch('/api/wedgies-apply', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <Image
              src="/logos/wedgies.jpg"
              alt="Wedgies logo"
              width={120}
              height={120}
              className="mx-auto rounded-2xl"
            />
          </div>
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-[#efe5cd] mb-3">Application Submitted!</h1>
          <p className="text-[#efe5cd]/60 text-lg">
            Thanks for applying to Wedgie&apos;s! We&apos;ll review your application and get back to you soon.
          </p>
          <div className="mt-8 p-4 bg-white/[0.03] border border-white/10 rounded-xl">
            <p className="text-sm text-[#efe5cd]/40">
              Questions? Stop by the store at{' '}
              <span className="text-[#efe5cd]/70">2212 W 1800 N Ste. B, Clinton, UT</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#0f0f0f] z-10" />
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <Image
            src="/wedgies/wedgie-cba-hero.png"
            alt="Wedgies fresh salads"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
          <Image
            src="/logos/wedgies.jpg"
            alt="Wedgies logo"
            width={100}
            height={100}
            className="rounded-2xl shadow-2xl mb-4"
          />
          <h1 className="text-3xl sm:text-4xl font-black text-white text-center tracking-tight">
            We&apos;re Hiring!
          </h1>
          <p className="text-white/70 text-sm sm:text-base mt-2 text-center max-w-md">
            Join the Wedgie&apos;s crew — greens, proteins, and ice cream.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-10 -mt-8 relative z-30">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#efe5cd] mb-4">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#efe5cd]/40 uppercase tracking-wider mb-1.5">
                  First Name <span className="text-[#c9533c]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-[#efe5cd] placeholder-[#efe5cd]/20 focus:outline-none focus:border-[#c9533c]/50 transition-colors"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-xs text-[#efe5cd]/40 uppercase tracking-wider mb-1.5">
                  Last Name <span className="text-[#c9533c]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-[#efe5cd] placeholder-[#efe5cd]/20 focus:outline-none focus:border-[#c9533c]/50 transition-colors"
                  placeholder="Last name"
                />
              </div>
              <div>
                <label className="block text-xs text-[#efe5cd]/40 uppercase tracking-wider mb-1.5">
                  Phone <span className="text-[#c9533c]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-[#efe5cd] placeholder-[#efe5cd]/20 focus:outline-none focus:border-[#c9533c]/50 transition-colors"
                  placeholder="(801) 555-1234"
                />
              </div>
              <div>
                <label className="block text-xs text-[#efe5cd]/40 uppercase tracking-wider mb-1.5">
                  Email <span className="text-[#c9533c]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-[#efe5cd] placeholder-[#efe5cd]/20 focus:outline-none focus:border-[#c9533c]/50 transition-colors"
                  placeholder="you@email.com"
                />
              </div>
            </div>
          </section>

          {/* Age Range */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#efe5cd] mb-1">What is your age range?</h2>
            <p className="text-xs text-[#efe5cd]/40 mb-4">Required for scheduling and compliance</p>
            <div className="flex flex-wrap gap-3">
              {['15 or younger', '16 to 18', '19+'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setAgeRange(range)}
                  className={`px-5 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                    ageRange === range
                      ? 'bg-[#c9533c] border-[#c9533c] text-white'
                      : 'bg-white/[0.03] border-white/10 text-[#efe5cd]/60 hover:border-[#c9533c]/30 hover:text-[#efe5cd]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            {!ageRange && (
              <input type="text" required value={ageRange} onChange={() => {}} className="sr-only" tabIndex={-1} />
            )}
          </section>

          {/* Why Work Here */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#efe5cd] mb-1">
              Why would you like to work at Wedgie&apos;s?
            </h2>
            <p className="text-xs text-[#efe5cd]/40 mb-4">Tell us a little about yourself</p>
            <textarea
              value={whyWorkHere}
              onChange={(e) => setWhyWorkHere(e.target.value)}
              rows={4}
              className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-[#efe5cd] placeholder-[#efe5cd]/20 focus:outline-none focus:border-[#c9533c]/50 transition-colors resize-none"
              placeholder="What excites you about working here?"
            />
          </section>

          {/* Work Experience */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#efe5cd] mb-1">Previous Work Experience</h2>
            <p className="text-xs text-[#efe5cd]/40 mb-4">Add your recent jobs (optional)</p>

            <div className="space-y-4">
              {workExperience.map((entry, index) => (
                <div
                  key={index}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#efe5cd]/30 font-semibold uppercase tracking-wider">
                      Job {index + 1}
                    </span>
                    {workExperience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkEntry(index)}
                        className="p-1.5 text-[#efe5cd]/30 hover:text-[#c9533c] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={entry.location}
                    onChange={(e) => updateWorkEntry(index, 'location', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#efe5cd] placeholder-[#efe5cd]/20 focus:outline-none focus:border-[#c9533c]/50 transition-colors"
                    placeholder="Company / Location"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#efe5cd]/30 uppercase tracking-wider mb-1">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={entry.startDate}
                        onChange={(e) => updateWorkEntry(index, 'startDate', e.target.value)}
                        className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#efe5cd] focus:outline-none focus:border-[#c9533c]/50 transition-colors [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#efe5cd]/30 uppercase tracking-wider mb-1">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={entry.endDate}
                        onChange={(e) => updateWorkEntry(index, 'endDate', e.target.value)}
                        className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#efe5cd] focus:outline-none focus:border-[#c9533c]/50 transition-colors [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <textarea
                    value={entry.duties}
                    onChange={(e) => updateWorkEntry(index, 'duties', e.target.value)}
                    rows={2}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#efe5cd] placeholder-[#efe5cd]/20 focus:outline-none focus:border-[#c9533c]/50 transition-colors resize-none"
                    placeholder="Job duties"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addWorkEntry}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#c9533c] hover:text-[#c9533c]/80 transition-colors"
            >
              <Plus size={16} /> Add another job
            </button>
          </section>

          {/* Availability */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#efe5cd] mb-1">What is your availability?</h2>
            <p className="text-xs text-[#efe5cd]/40 mb-4">
              Tap the days you&apos;re available, then set your hours
            </p>

            <div className="space-y-3">
              {DAYS.map((day) => {
                const isActive = !!availability[day];
                return (
                  <div key={day} className="space-y-2">
                    <button
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#c9533c]/10 border-[#c9533c]/30 text-[#efe5cd]'
                          : 'bg-white/[0.02] border-white/[0.06] text-[#efe5cd]/40 hover:border-white/10 hover:text-[#efe5cd]/60'
                      }`}
                    >
                      <span>{day}</span>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isActive ? 'border-[#c9533c] bg-[#c9533c]' : 'border-white/20'
                        }`}
                      >
                        {isActive && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </button>
                    {isActive && availability[day] && (
                      <div className="flex items-center gap-2 pl-4 pb-1">
                        <input
                          type="time"
                          value={availability[day]!.start}
                          onChange={(e) => updateDayTime(day, 'start', e.target.value)}
                          className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-[#efe5cd] focus:outline-none focus:border-[#c9533c]/50 transition-colors [color-scheme:dark]"
                        />
                        <span className="text-[#efe5cd]/30 text-xs">to</span>
                        <input
                          type="time"
                          value={availability[day]!.end}
                          onChange={(e) => updateDayTime(day, 'end', e.target.value)}
                          className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-[#efe5cd] focus:outline-none focus:border-[#c9533c]/50 transition-colors [color-scheme:dark]"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Resume Upload */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#efe5cd] mb-1">Upload Resume</h2>
            <p className="text-xs text-[#efe5cd]/40 mb-4">PDF or Word document (optional)</p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="hidden"
            />

            {resume ? (
              <div className="flex items-center justify-between bg-white/[0.05] border border-[#c9533c]/20 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#c9533c]/10 flex items-center justify-center">
                    <Upload size={16} className="text-[#c9533c]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#efe5cd] font-medium">{resume.name}</p>
                    <p className="text-xs text-[#efe5cd]/40">
                      {(resume.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResume(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1.5 text-[#efe5cd]/30 hover:text-[#c9533c] transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-2 py-8 border-2 border-dashed border-white/10 rounded-xl text-[#efe5cd]/30 hover:border-[#c9533c]/30 hover:text-[#efe5cd]/50 transition-all cursor-pointer"
              >
                <Upload size={24} />
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs">PDF, DOC, or DOCX — Max 10MB</span>
              </button>
            )}
          </section>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#c9533c] text-white font-bold text-lg rounded-xl hover:bg-[#b8432c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>

          <p className="text-center text-xs text-[#efe5cd]/30">
            Your information is kept private and only used for the hiring process.
          </p>
        </form>

        {/* Food images for flair */}
        <div className="mt-12 grid grid-cols-3 gap-3 opacity-60">
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <Image src="/wedgies/wedgie-cba.png" alt="Wedgie salad" fill className="object-cover" />
          </div>
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <Image src="/wedgies/wedgito-cba.png" alt="Wedgito" fill className="object-cover" />
          </div>
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <Image src="/wedgies/shake-reeses.png" alt="Shake" fill className="object-cover" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#efe5cd]/20">
            Wedgie&apos;s · 2212 W 1800 N Ste. B, Clinton, UT · ilovewedgies.com
          </p>
        </div>
      </div>
    </div>
  );
}
