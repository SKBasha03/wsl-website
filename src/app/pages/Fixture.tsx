import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

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
      { home: { name: "Majunu" }, away: { name: "Spartan" }, meta: "Monday | March 09, 2026" },
      { home: { name: "Majunu" }, away: { name: "Harry" }, meta: "Tuesday | March 10, 2026" },
      { home: { name: "Majunu" }, away: { name: "Hasagi" }, meta: "Wednesday | March 11, 2026" },
      { home: { name: "Hasagi" }, away: { name: "Harry" }, meta: "Thursday | March 12, 2026" },
      { home: { name: "Hasagi" }, away: { name: "Spartan" }, meta: "Friday | March 13, 2026" },
      { home: { name: "Harry" }, away: { name: "Spartan" }, meta: "Friday | March 13, 2026" },
    ],
    B: [
      { home: { name: "Nightfury" }, away: { name: "Corona" }, meta: "Monday | March 09, 2026" },
      { home: { name: "Nightfury" }, away: { name: "Kentucky" }, meta: "Tuesday | March 10, 2026" },
      { home: { name: "Nightfury" }, away: { name: "Wizard" }, meta: "Wednesday | March 11, 2026" },
      { home: { name: "Corona" }, away: { name: "Kentucky" }, meta: "Thursday | March 12, 2026" },
      { home: { name: "Corona" }, away: { name: "Wizard" }, meta: "Monday | March 09, 2026" },
      { home: { name: "Kentucky" }, away: { name: "Wizard" }, meta: "Wednesday | March 11, 2026" },
    ],
    C: [
      { home: { name: "Jilla" }, away: { name: "Santy" }, meta: "Sunday | March 15, 2026" },
      { home: { name: "Jilla" }, away: { name: "Slayer" }, meta: "Saturday | March 14, 2026" },
      { home: { name: "Jilla" }, away: { name: "Sudhir" }, meta: "Saturday | March 14, 2026" },
      { home: { name: "Santy" }, away: { name: "Slayer" }, meta: "Monday | March 09, 2026" },
      { home: { name: "Santy" }, away: { name: "Sudhir" }, meta: "Tuesday | March 10, 2026" },
      { home: { name: "Slayer" }, away: { name: "Sudhir" }, meta: "Wednesday | March 11, 2026" },
    ],
    D: [
      { home: { name: "Mind" }, away: { name: "Adhil" }, meta: "Monday | March 09, 2026" },
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
      { home: { name: "Adhireya" }, away: { name: "Ejas" }, meta: "Monday | March 09, 2026" },
      { home: { name: "Adhireya" }, away: { name: "Akhil" }, meta: "Monday | March 09, 2026" },
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

function TeamBox({ team, center }: { team?: TeamSlot; center?: boolean }) {
  return (
    <div
      className={`h-8 w-full rounded-md border border-white/10 bg-white/5 px-3 flex items-center${
        center ? " justify-center" : ""
      }`}
    >
      <div className={`truncate text-sm font-medium text-white${center ? " text-center" : ""}`}>{team?.name ?? ""}</div>
    </div>
  );
}

function ScoreBox({ value }: { value?: number }) {
  return (
    <div className="h-8 w-9 rounded-md border border-white/10 bg-white/5 flex items-center justify-center">
      <div className="text-sm text-white tabular-nums">{value ?? ""}</div>
    </div>
  );
}

function FixtureLine({ row, centerTeams }: { row: FixtureRow; centerTeams?: boolean }) {
  const hasScores = row.homeScore != null || row.awayScore != null;

  if (!hasScores) {
    return (
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <TeamBox team={row.home} center={centerTeams} />
        <div className="h-8 min-w-12 rounded-md border border-white/10 bg-white/5 px-3 flex items-center justify-center">
          <div className="text-xs font-semibold tracking-widest text-white/80">VS</div>
        </div>
        <TeamBox team={row.away} center={centerTeams} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-2">
      <TeamBox team={row.home} center={centerTeams} />
      <ScoreBox value={row.homeScore} />
      <div className="h-px w-3 bg-white/15" />
      <ScoreBox value={row.awayScore} />
      <TeamBox team={row.away} center={centerTeams} />
    </div>
  );
}

function formatMeta(meta?: string) {
  if (!meta) return "";
  return meta.replaceAll(" | ", " • ");
}

type MetaStatus = "finished" | "ongoing" | "upcoming" | "unknown";

function parseMetaDate(meta?: string): Date | null {
  if (!meta) return null;

  // Supports strings like:
  // "Monday | March 09, 2026" or "Monday • March 09, 2026"
  const match = meta.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!match) return null;

  const monthName = match[1];
  const day = Number(match[2]);
  const year = Number(match[3]);
  if (!Number.isFinite(day) || !Number.isFinite(year)) return null;

  const monthIndexByName: Record<string, number> = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  const monthIndex = monthIndexByName[monthName];
  if (monthIndex == null) return null;

  return new Date(year, monthIndex, day);
}

function toDateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getMetaStatus(meta?: string): MetaStatus {
  const matchDate = parseMetaDate(meta);
  if (!matchDate) return "unknown";

  const today = toDateOnly(new Date());
  const matchDay = toDateOnly(matchDate);

  if (matchDay.getTime() < today.getTime()) return "finished";
  if (matchDay.getTime() > today.getTime()) return "upcoming";
  return "ongoing";
}

function MetaChip({ meta }: { meta: string }) {
  const status = getMetaStatus(meta);

  const chipClassNameByStatus: Record<MetaStatus, string> = {
    finished: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    ongoing: "border-white/15 bg-white/5 text-white/80",
    upcoming: "border-sky-500/30 bg-sky-500/10 text-sky-200",
    unknown: "border-white/10 bg-white/5 text-gray-400/90",
  };

  const dotClassNameByStatus: Record<MetaStatus, string> = {
    finished: "bg-emerald-400",
    ongoing: "bg-white/80",
    upcoming: "bg-sky-400",
    unknown: "bg-white/30",
  };

  return (
    <div className="flex justify-center pt-0.5">
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 ${chipClassNameByStatus[status]}`}
      >
        <div className={`h-1.5 w-1.5 rounded-full ${dotClassNameByStatus[status]}`} />
        <div className="text-[11px] leading-none">{formatMeta(meta)}</div>
      </div>
    </div>
  );
}

function GroupBlock({
  group,
  rows,
  className,
}: {
  group: GroupKey;
  rows: FixtureRow[];
  className?: string;
}) {
  return (
    <Card className={`bg-white/5 border-white/10 backdrop-blur-sm${className ? ` ${className}` : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm font-semibold">GROUP {group}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row, idx) => (
          <div key={idx} className="space-y-1">
            <FixtureLine row={row} centerTeams />
            {row.meta ? <MetaChip meta={row.meta} /> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function KnockoutColumn({
  title,
  rows,
  emphasized,
  className,
}: {
  title: string;
  rows: FixtureRow[];
  emphasized?: boolean;
  className?: string;
}) {
  const baseClassName = emphasized
    ? "bg-white/10 border-white/15 backdrop-blur-sm"
    : "bg-white/5 border-white/10 backdrop-blur-sm";

  return (
    <Card className={`${baseClassName}${className ? ` ${className}` : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm font-semibold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row, idx) => (
          <div key={idx} className="space-y-2">
            <FixtureLine row={row} />
            {row.meta ? <MetaChip meta={row.meta} /> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function BracketConnectors() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-0 top-1/2 h-[1px] w-full bg-white/10" />
      <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/10" />
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
    { value: "evolution", label: "Wano Evolution League" },
    { value: "super", label: "Wano Super League" },
  ];

  // Read league from URL params, default to "continental"
  const leagueParam = searchParams.get("league");
  const isValidLeague = (val: string | null): val is LeagueCategory => {
    return val === "continental" || val === "evolution" || val === "super";
  };
  const activeLeague: LeagueCategory = isValidLeague(leagueParam) ? leagueParam : "continental";

  const activeIndex = leagues.findIndex((l) => l.value === activeLeague);

  const handleLeagueChange = (league: LeagueCategory) => {
    setSearchParams({ league });
  };

  useEffect(() => {
    const activeButton = buttonRefs.current[activeIndex];
    if (activeButton) {
      setPillStyle({
        width: activeButton.offsetWidth,
        left: activeButton.offsetLeft,
      });
    }
  }, [activeIndex]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-white">{data.title}</h1>
        <p className="text-gray-400 mt-2">Fixture bracket</p>
      </div>

      <div className="space-y-10">
        {/* League Category Selector */}
        <div className="flex justify-center">
          <div className="relative inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 p-1">
            {/* Animated pill background */}
            <div
              className="absolute top-1 h-[calc(100%-8px)] rounded-md bg-white/10 transition-all duration-300 ease-out"
              style={{
                width: `${pillStyle.width}px`,
                transform: `translateX(${pillStyle.left}px)`,
              }}
            />
            {leagues.map((league, index) => (
              <button
                key={league.value}
                ref={(el) => (buttonRefs.current[index] = el)}
                onClick={() => handleLeagueChange(league.value)}
                className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeLeague === league.value ? "text-white" : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {league.label}
              </button>
            ))}
          </div>
        </div>

        {activeLeague === "continental" && (
          <div className="space-y-10">
          {/* GROUPS */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white"></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1800px] mx-auto">
              <GroupBlock group="A" rows={data.groups.A} className="w-full" />
              <GroupBlock group="B" rows={data.groups.B} className="w-full" />
              <GroupBlock group="C" rows={data.groups.C} className="w-full" />
              <GroupBlock group="D" rows={data.groups.D} className="w-full" />
              <GroupBlock group="E" rows={data.groups.E} className="w-full" />
              <GroupBlock group="F" rows={data.groups.F} className="w-full" />
            </div>
          </section>

          {/* KNOCKOUT */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white"></h2>

            <div className="overflow-x-auto">
              <div className="w-fit min-w-[820px] mx-auto">
                <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                  <BracketConnectors />

                  <div className="space-y-6">
                    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,460px)_minmax(0,460px)] xl:justify-center">
                      <KnockoutColumn title="ROUND OF 16" rows={data.knockout.r16.slice(0, 4)} className="w-full" />
                      <KnockoutColumn title="ROUND OF 16" rows={data.knockout.r16.slice(4, 8)} className="w-full" />
                    </div>

                    <KnockoutColumn title="QUARTER FINALS" rows={data.knockout.qf} emphasized className="mx-auto max-w-[720px]" />
                    <KnockoutColumn title="SEMI FINALS" rows={data.knockout.sf} emphasized className="mx-auto max-w-[560px]" />
                    <KnockoutColumn title="FINAL" rows={data.knockout.final} emphasized className="mx-auto max-w-[440px]" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        )}

        {activeLeague === "evolution" && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Coming soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Wano Evolution League fixture will be added soon.</p>
            </CardContent>
          </Card>
        )}

        {activeLeague === "super" && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Coming soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Wano Super League fixture will be added soon.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
