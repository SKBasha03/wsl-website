import { useMemo } from "react";
import { Badge } from "../components/ui/badge";
import { Calendar, CheckCircle2, Clock, ChevronDown } from "lucide-react";
import { getAllScheduledMatches, parseMatchDate } from "../lib/scheduleData";

export function Home() {
  const allMatches = useMemo(() => getAllScheduledMatches(), []);
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);

  const completedMatches = useMemo(
    () => allMatches.filter(m => { const d = parseMatchDate(m.meta); return d && d < today; }).length,
    [allMatches, today]
  );
  const upcomingDated = useMemo(
    () => allMatches.filter(m => { const d = parseMatchDate(m.meta); return d && d >= today; }).length,
    [allMatches, today]
  );
  const totalMatches = 67;
  const upcomingMatches = upcomingDated + Math.max(0, 67 - allMatches.length);

  return (
    <div className="w-full">

      {/* ── CINEMATIC HERO ──────────────────────────────────── */}
      <div className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 text-center">

        {/* Deep radial glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[800px] h-[800px] rounded-full bg-white/[0.025] blur-[140px]" />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[350px] h-[350px] rounded-full bg-white/[0.045] blur-[70px]" />
        </div>

        {/* Subtle scan lines feel */}
        <div className="pointer-events-none absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="pointer-events-none absolute top-[80%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Corner marks */}
        <div className="pointer-events-none absolute top-8 left-8 w-8 h-8 border-t border-l border-white/10" />
        <div className="pointer-events-none absolute top-8 right-8 w-8 h-8 border-t border-r border-white/10" />
        <div className="pointer-events-none absolute bottom-8 left-8 w-8 h-8 border-b border-l border-white/10" />
        <div className="pointer-events-none absolute bottom-8 right-8 w-8 h-8 border-b border-r border-white/10" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-5xl">
          {/* Live badge */}
          <Badge className="bg-white/[0.06] border border-white/[0.12] text-white/50 text-[10px] font-bold tracking-[0.35em] uppercase px-5 py-1.5 rounded-full">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-2.5 animate-pulse" />
            Season 1 · Now Live
          </Badge>

          {/* Main title */}
          <div className="space-y-1">
            <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase text-white/20 font-bold">Est. 2026</p>
            <h1 className="text-[clamp(4rem,15vw,11rem)] font-black tracking-[-0.03em] text-white leading-[0.82]">
              WANO
            </h1>
            <h2 className="text-[clamp(0.9rem,3.5vw,2.2rem)] font-black tracking-[0.25em] text-white/20 leading-none">
              SUPER LEAGUE
            </h2>
          </div>

          {/* Tagline */}
          <p className="text-base md:text-xl text-white/35 max-w-md leading-relaxed font-medium mt-2">
            Where legends are made. Every match, every transfer, every triumph.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {[
              { icon: Calendar, label: "Matches", value: totalMatches },
              { icon: CheckCircle2, label: "Played", value: completedMatches },
              { icon: Clock, label: "Remaining", value: upcomingMatches },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-2">
                <Icon className="h-3.5 w-3.5 text-white/30" />
                <span className="text-white font-black text-sm">{value}</span>
                <span className="text-white/30 text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/15 animate-bounce">
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>

    </div>
  );
}

