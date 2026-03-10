import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router";

type TeamSlot = {
  name?: string;
};

type FixtureRow = {
  home?: TeamSlot;
  away?: TeamSlot;
  meta?: string;
  homeScore?: number;
  awayScore?: number;
};

type GroupKey = "A" | "B" | "C" | "D" | "E" | "F";

type KnockoutKey = "r16" | "qf" | "sf" | "final";

type FixtureData = {
  title: string;
  groups: Record<GroupKey, FixtureRow[]>;
  knockout: Record<KnockoutKey, FixtureRow[]>;
};

const EMPTY_FIXTURE: FixtureData = {
  title: "WANO SUPER LEAGUE 26",
  groups: {
    A: [
      { home: { name: "Majunu" }, away: { name: "Spartan" }, meta: "Monday | March 09, 2026", homeScore: 2, awayScore: 10 },
      { home: { name: "Majunu" }, away: { name: "Harry" }, meta: "Tuesday | March 10, 2026" },
      { home: { name: "Majunu" }, away: { name: "Hasagi" }, meta: "Wednesday | March 11, 2026" },
      { home: { name: "Hasagi" }, away: { name: "Harry" }, meta: "Thursday | March 12, 2026" },
      { home: { name: "Hasagi" }, away: { name: "Spartan" }, meta: "Friday | March 13, 2026" },
      { home: { name: "Harry" }, away: { name: "Spartan" }, meta: "Friday | March 13, 2026" },
    ],
    B: [
      { home: { name: "Nightfury" }, away: { name: "Corona" }, meta: "Monday | March 09, 2026", homeScore: 5, awayScore: 1 },
      { home: { name: "Nightfury" }, away: { name: "Kentucky" }, meta: "Tuesday | March 10, 2026" },
      { home: { name: "Nightfury" }, away: { name: "Wizard" }, meta: "Wednesday | March 11, 2026" },
      { home: { name: "Corona" }, away: { name: "Kentucky" }, meta: "Thursday | March 12, 2026" },
      { home: { name: "Corona" }, away: { name: "Wizard" }, meta: "Monday | March 09, 2026", homeScore: 0, awayScore: 12 },
      { home: { name: "Kentucky" }, away: { name: "Wizard" }, meta: "Wednesday | March 11, 2026" },
    ],
    C: [
      { home: { name: "Jilla" }, away: { name: "Santy" }, meta: "Sunday | March 15, 2026" },
      { home: { name: "Jilla" }, away: { name: "Slayer" }, meta: "Saturday | March 14, 2026" },
      { home: { name: "Jilla" }, away: { name: "Sudhir" }, meta: "Saturday | March 14, 2026" },
      { home: { name: "Santy" }, away: { name: "Slayer" }, meta: "Monday | March 09, 2026", homeScore: 0, awayScore: 12},
      { home: { name: "Santy" }, away: { name: "Sudhir" }, meta: "Tuesday | March 10, 2026" },
      { home: { name: "Slayer" }, away: { name: "Sudhir" }, meta: "Wednesday | March 11, 2026" },
    ],
    D: [
      { home: { name: "Mind" }, away: { name: "Adhil" }, meta: "Monday | March 09, 2026", homeScore: 10, awayScore: 2 },
      { home: { name: "Mind" }, away: { name: "Arvind Siva" }, meta: "Wednesday | March 11, 2026" },
      { home: { name: "Mind" }, away: { name: "Rushyy" }, meta: "Tuesday | March 10, 2026" },
      { home: { name: "Adhil" }, away: { name: "Arvind Siva" }, meta: "Thursday | March 12, 2026" },
      { home: { name: "Adhil" }, away: { name: "Rushyy" }, meta: "Friday | March 13, 2026" },
      { home: { name: "Arvind Siva" }, away: { name: "Rushyy" }, meta: "Friday | March 13, 2026" },
    ],
    E: [
      { home: { name: "Abhiram" }, away: { name: "ADN" }, meta: "Sunday | March 15, 2026" },
      { home: { name: "Abhiram" }, away: { name: "Flat-C" }, meta: "Tuesday | March 10, 2026" },
      { home: { name: "Abhiram" }, away: { name: "Sibin Michael" }, meta: "Saturday | March 14, 2026" },
      { home: { name: "ADN" }, away: { name: "Flat-C" }, meta: "Sunday | March 15, 2026" },
      { home: { name: "ADN" }, away: { name: "Sibin Michael" }, meta: "Saturday | March 14, 2026" },
      { home: { name: "Flat-C" }, away: { name: "Sibin Michael" }, meta: "Saturday | March 14, 2026" },
    ],
    F: [
      { home: { name: "Adhireya" }, away: { name: "Meethun" }, meta: "Friday | March 13, 2026" },
      { home: { name: "Adhireya" }, away: { name: "Ejas" }, meta: "Monday | March 09, 2026", homeScore: 0, awayScore: 3 },
      { home: { name: "Adhireya" }, away: { name: "Akhil" }, meta: "Monday | March 09, 2026", homeScore: 0, awayScore: 3 },
      { home: { name: "Meethun" }, away: { name: "Ejas" }, meta: "Friday | March 13, 2026" },
      { home: { name: "Meethun" }, away: { name: "Akhil" }, meta: "Friday | March 13, 2026" },
      { home: { name: "Ejas" }, away: { name: "Akhil" }, meta: "Wednesday | March 11, 2026" },
    ],
  },
  knockout: {
    r16: Array.from({ length: 8 }, () => ({})),
    qf: Array.from({ length: 4 }, () => ({})),
    sf: Array.from({ length: 2 }, () => ({})),
    final: Array.from({ length: 1 }, () => ({})),
  },
};

// ─── accent palette per group ────────────────────────────────────────────────
// Uniform monochrome to match site theme
const GROUP_ACCENT: Record<GroupKey, { text: string; border: string; topVia: string; bar: string }> = {
  A: { text: "text-white", border: "border-white/[0.08]", topVia: "via-white/20", bar: "bg-white/40" },
  B: { text: "text-white", border: "border-white/[0.08]", topVia: "via-white/20", bar: "bg-white/40" },
  C: { text: "text-white", border: "border-white/[0.08]", topVia: "via-white/20", bar: "bg-white/40" },
  D: { text: "text-white", border: "border-white/[0.08]", topVia: "via-white/20", bar: "bg-white/40" },
  E: { text: "text-white", border: "border-white/[0.08]", topVia: "via-white/20", bar: "bg-white/40" },
  F: { text: "text-white", border: "border-white/[0.08]", topVia: "via-white/20", bar: "bg-white/40" },
};

// ─── status helpers ───────────────────────────────────────────────────────────

type MetaStatus = "finished" | "ongoing" | "upcoming" | "unknown";

function parseMetaDate(meta?: string): Date | null {
  if (!meta) return null;
  const match = meta.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!match) return null;
  const monthName = match[1];
  const day = Number(match[2]);
  const year = Number(match[3]);
  if (!Number.isFinite(day) || !Number.isFinite(year)) return null;
  const months: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };
  const m = months[monthName];
  if (m == null) return null;
  return new Date(year, m, day);
}

function toDateOnly(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getMetaStatus(meta?: string): MetaStatus {
  const date = parseMetaDate(meta);
  if (!date) return "unknown";
  const today = toDateOnly(new Date());
  const day   = toDateOnly(date);
  if (day.getTime() < today.getTime()) return "finished";
  if (day.getTime() > today.getTime()) return "upcoming";
  return "ongoing";
}

// ─── status dot ───────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: MetaStatus }) {
  const cls: Record<MetaStatus, string> = {
    finished: "bg-emerald-400",
    ongoing:  "bg-white animate-pulse",
    upcoming: "bg-sky-400",
    unknown:  "bg-white/20",
  };
  return <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cls[status]}`} />;
}

// ─── match row ────────────────────────────────────────────────────────────────
function MatchRow({ row, index }: { row: FixtureRow; index: number }) {
  const status    = getMetaStatus(row.meta);
  const hasScores = row.homeScore != null || row.awayScore != null;
  const leftBorder: Record<MetaStatus, string> = {
    finished: "border-l-emerald-500/50",
    ongoing:  "border-l-white/60",
    upcoming: "border-l-sky-500/50",
    unknown:  "border-l-white/10",
  };
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-white/[0.07] border-l-2 ${leftBorder[status]} bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-200`}
      style={{ animation: `fadeSlideUp 0.35s ease ${index * 0.04}s both` }}
    >
      {/* shimmer sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      <div className="relative px-3 py-2.5">
        {/* teams */}
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {row.home?.name ?? <span className="text-white/25 italic text-xs font-normal">TBD</span>}
            </p>
          </div>
          {hasScores ? (
            <div className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
              <span className="text-sm font-bold text-white tabular-nums">{row.homeScore}</span>
              <span className="text-white/30 text-xs mx-0.5">–</span>
              <span className="text-sm font-bold text-white tabular-nums">{row.awayScore}</span>
            </div>
          ) : (
            <div className="shrink-0 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">
              <span className="text-[10px] font-bold tracking-[0.14em] text-white/35">VS</span>
            </div>
          )}
          <div className="flex-1 min-w-0 text-right">
            <p className="truncate text-sm font-semibold text-white text-right">
              {row.away?.name ?? <span className="text-white/25 italic text-xs font-normal">TBD</span>}
            </p>
          </div>
        </div>
        {/* date & status */}
        {row.meta && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <StatusDot status={status} />
            <span className="text-[10px] text-white/35 tracking-wide">{row.meta.replace(" | ", " · ")}</span>
            {status === "ongoing" && (
              <span className="ml-auto text-[10px] font-bold text-white/60 tracking-widest">LIVE</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── group card ───────────────────────────────────────────────────────────────
function GroupCard({ group, rows, animIndex }: { group: GroupKey; rows: FixtureRow[]; animIndex: number }) {
  const accent   = GROUP_ACCENT[group];
  const finished = rows.filter(r => getMetaStatus(r.meta) === "finished").length;
  const total    = rows.length;
  const pct      = total > 0 ? Math.round((finished / total) * 100) : 0;
  return (
    <div
      className={`relative rounded-2xl border ${accent.border} bg-white/[0.025] backdrop-blur-sm overflow-hidden`}
      style={{ animation: `fadeSlideUp 0.45s ease ${0.05 + animIndex * 0.07}s both` }}
    >
      {/* top accent line */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${accent.topVia} to-transparent`} />
      {/* header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black tracking-tighter select-none text-white/90">G{group}</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Group {group}</p>
            <p className="text-[10px] text-white/25">{finished}/{total} played</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-white/25">{pct}%</span>
          <div className="w-14 h-1 rounded-full bg-white/[0.07] overflow-hidden">
            <div
              className={`h-full rounded-full ${accent.bar}`}
              style={{ width: `${pct}%`, transition: "width 1s ease 0.5s" }}
            />
          </div>
        </div>
      </div>
      <div className="mx-4 h-px bg-white/[0.05]" />
      {/* matches */}
      <div className="px-4 pb-5 pt-3 space-y-2">
        {rows.map((row, idx) => (
          <MatchRow key={idx} row={row} index={idx} />
        ))}
      </div>
    </div>
  );
}

// ─── knockout card ────────────────────────────────────────────────────────────
function KnockoutCard({
  title, rows, emphasized = false, animIndex = 0,
}: {
  title: string; rows: FixtureRow[]; emphasized?: boolean; animIndex?: number;
}) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden backdrop-blur-sm ${
        emphasized
          ? "border border-white/20 bg-white/[0.055]"
          : "border border-white/[0.08] bg-white/[0.025]"
      }`}
      style={{ animation: `fadeSlideUp 0.4s ease ${0.1 + animIndex * 0.08}s both` }}
    >
      {emphasized && (
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      )}
      <div className="px-4 py-5 space-y-3">
        <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] text-center ${
          emphasized ? "text-white/60" : "text-white/35"
        }`}>
          {title}
        </h3>
        <div className="space-y-2">
          {rows.map((row, idx) => (
            <MatchRow key={idx} row={row} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

type LeagueCategory = "continental" | "evolution" | "super";

export function Fixture() {
  const data = EMPTY_FIXTURE;
  const [searchParams, setSearchParams] = useSearchParams();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0 });

  const leagues: Array<{ value: LeagueCategory; label: string }> = [
    { value: "continental", label: "Wano Continental League" },
    { value: "evolution",   label: "Wano Evolution League"   },
    { value: "super",       label: "Wano Super League"        },
  ];

  const leagueParam  = searchParams.get("league");
  const isValid      = (v: string | null): v is LeagueCategory =>
    v === "continental" || v === "evolution" || v === "super";
  const activeLeague: LeagueCategory = isValid(leagueParam) ? leagueParam : "continental";
  const activeIndex  = leagues.findIndex(l => l.value === activeLeague);

  useEffect(() => {
    const btn = buttonRefs.current[activeIndex];
    if (btn) setPillStyle({ width: btn.offsetWidth, left: btn.offsetLeft });
  }, [activeIndex]);

  const allMatches = Object.values(data.groups).flat();
  const finished   = allMatches.filter(r => getMetaStatus(r.meta) === "finished").length;
  const total      = 67; // Group stage (36) + WCL knockouts (15) + WEL knockouts (15) + WSL final (1)

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* ── HERO HEADER ──────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-sm px-6 py-10 text-center"
        style={{ animation: "fadeSlideUp 0.5s ease 0s both" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(255,255,255,0.05),transparent)]" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Season 1 · Now Live</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            WANO <span className="text-white/30">SUPER LEAGUE</span>
          </h1>
          <p className="text-white/25 text-xs tracking-[0.25em] uppercase">2025 / 2026 · Fixture Bracket</p>
          <div className="flex justify-center gap-8 pt-3">
            {[
              { label: "Played",    value: finished         },
              { label: "Remaining", value: total - finished },
              { label: "Total",     value: total            },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-white tabular-nums">{s.value}</p>
                <p className="text-[9px] uppercase tracking-wider text-white/30 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LEAGUE TABS ─────────────────────────────────────────── */}
      <div className="flex justify-center" style={{ animation: "fadeSlideUp 0.5s ease 0.08s both" }}>
        <div className="relative inline-flex items-center gap-0.5 rounded-xl border border-white/10 bg-white/[0.04] p-1">
          <div
            className="absolute top-1 h-[calc(100%-8px)] rounded-lg bg-white/10 border border-white/15 transition-all duration-300 ease-out"
            style={{ width: pillStyle.width, transform: `translateX(${pillStyle.left}px)` }}
          />
          {leagues.map((lg, i) => (
            <button
              key={lg.value}
              ref={el => (buttonRefs.current[i] = el)}
              onClick={() => setSearchParams({ league: lg.value })}
              className={`relative z-10 px-4 py-2 text-xs font-semibold tracking-wide rounded-lg transition-colors duration-200 ${
                activeLeague === lg.value ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {lg.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTINENTAL ─────────────────────────────────────────── */}
      {activeLeague === "continental" && (
        <div className="space-y-12">

          {/* group stage */}
          <section>
            <div className="flex items-center gap-3 mb-6" style={{ animation: "fadeSlideUp 0.4s ease 0.12s both" }}>
              <div className="h-px flex-1 bg-white/[0.07]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Group Stage</span>
              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {(["A","B","C","D","E","F"] as GroupKey[]).map((g, i) => (
                <GroupCard key={g} group={g} rows={data.groups[g]} animIndex={i} />
              ))}
            </div>
          </section>

          {/* knockout stage */}
          <section>
            <div className="flex items-center gap-3 mb-6" style={{ animation: "fadeSlideUp 0.4s ease 0.15s both" }}>
              <div className="h-px flex-1 bg-white/[0.07]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Knockout Stage</span>
              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[640px] space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <KnockoutCard title="Round of 16" rows={data.knockout.r16.slice(0, 4)} animIndex={0} />
                  <KnockoutCard title="Round of 16" rows={data.knockout.r16.slice(4, 8)} animIndex={1} />
                </div>
                <KnockoutCard title="Quarter Finals" rows={data.knockout.qf} emphasized animIndex={2} />
                <div className="max-w-2xl mx-auto">
                  <KnockoutCard title="Semi Finals" rows={data.knockout.sf} emphasized animIndex={3} />
                </div>
                <div className="max-w-xl mx-auto">
                  <KnockoutCard title="⚽  Final" rows={data.knockout.final} emphasized animIndex={4} />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── COMING SOON ─────────────────────────────────────────── */}
      {(activeLeague === "evolution" || activeLeague === "super") && (
        <div
          className="flex flex-col items-center justify-center py-24 gap-4"
          style={{ animation: "fadeSlideUp 0.4s ease 0.1s both" }}
        >
          <div className="text-6xl select-none">🏆</div>
          <h2 className="text-2xl font-black text-white">Coming Soon</h2>
          <p className="text-white/30 text-sm">
            {leagues.find(l => l.value === activeLeague)?.label} fixture will be announced shortly.
          </p>
        </div>
      )}
    </div>
  );
}
