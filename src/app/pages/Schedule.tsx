import { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CalendarDays, Flag, Users, CheckCircle2, Clock } from "lucide-react";
import { getAllScheduledMatches, parseMatchDate, type ScheduleMatch, type GroupSchedule } from "../lib/scheduleData";

type LeagueKey = "wcl" | "wel" | "wsl";

function generateSixMatches(group: GroupSchedule["group"], teams: string[], status: ScheduleMatch["status"]): ScheduleMatch[] {
  const pairs: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  return pairs.map(([i, j], index) => {
    const home = teams[i] ?? "TBD";
    const away = teams[j] ?? "TBD";
    return {
      id: `${group}-${i}-${j}`,
      home,
      away,
      label: `Match ${index + 1}`,
      meta: status === "coming-soon" ? "Details coming soon" : "FC25 League Fixture",
      status,
    };
  });
}

function buildLeagueData(league: LeagueKey): GroupSchedule[] {
  const groups: GroupSchedule["group"][] = ["A", "B", "C", "D", "E", "F"];

  if (league === "wcl") {
    // Wano Continental League shows Group Stage matches
    const allMatches = getAllScheduledMatches();
    return groups.map((group) => ({
      group,
      matches: allMatches.filter((m) => m.id.startsWith(group)),
    }));
  }

  // WEL and WSL will show coming soon placeholders for now
  const isComingSoon = true;
  return groups.map((group) => {
    const teams = isComingSoon ? ["TBD", "TBD", "TBD", "TBD"] : [`${group}1`, `${group}2`, `${group}3`, `${group}4`];
    return {
      group,
      matches: generateSixMatches(group, teams, "coming-soon"),
    };
  });
}

export function Schedule() {
  const [activeLeague, setActiveLeague] = useState<LeagueKey>("wcl");

  const allLeaguesData = useMemo(
    () => ({
      wcl: buildLeagueData("wcl"),
      wel: buildLeagueData("wel"),
      wsl: buildLeagueData("wsl"),
    }),
    [],
  );

  // Calculate match statistics
  // NOTE: We currently have dated fixtures for the WCL group stage only.
  // The tournament total includes later-stage matches that don't have dates yet,
  // so we count those as "upcoming" until they're scheduled.
  const TOTAL_TOURNAMENT_MATCHES = 67;

  const groupStageMatches = useMemo(() => getAllScheduledMatches(), []);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const completedMatches = useMemo(() => {
    return groupStageMatches.filter((match) => {
      const matchDate = parseMatchDate(match.meta);
      return matchDate && matchDate < today;
    }).length;
  }, [groupStageMatches, today]);

  const upcomingMatches = useMemo(() => {
    const upcomingDated = groupStageMatches.filter((match) => {
      const matchDate = parseMatchDate(match.meta);
      return matchDate && matchDate >= today;
    }).length;

    const remainingUndated = Math.max(0, TOTAL_TOURNAMENT_MATCHES - groupStageMatches.length);
    return upcomingDated + remainingUndated;
  }, [groupStageMatches, today]);

  const totalMatches = TOTAL_TOURNAMENT_MATCHES;

  const activeLeagueData = allLeaguesData[activeLeague];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Tournament Schedule
        </h1>
        <p className="text-gray-400">WCL, WEL, and WSL fixtures across all tournament stages</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-400">Total Matches</CardTitle>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <CalendarDays className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{totalMatches}</div>
            <p className="text-sm text-gray-400">All Stages Combined</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-400">Completed Matches</CardTitle>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{completedMatches}</div>
            <p className="text-sm text-gray-400">Finished</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-400">Upcoming Matches</CardTitle>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{upcomingMatches}</div>
            <p className="text-sm text-gray-400">To Be Played</p>
          </CardContent>
        </Card>
      </div>

      {/* League Tabs */}
      <Tabs defaultValue="wcl" value={activeLeague} onValueChange={(v) => setActiveLeague(v as LeagueKey)} className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="bg-white/5 border border-white/10 p-1 h-12 rounded-lg">
            <TabsTrigger 
              value="wcl" 
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 font-semibold px-6 h-9 rounded-md transition-all duration-200"
            >
              Wano Continental League
            </TabsTrigger>
            <TabsTrigger 
              value="wel" 
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 font-semibold px-6 h-9 rounded-md transition-all duration-200"
            >
              Wano Evolution League
            </TabsTrigger>
            <TabsTrigger 
              value="wsl" 
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 font-semibold px-6 h-9 rounded-md transition-all duration-200"
            >
              Wano Super League
            </TabsTrigger>
          </TabsList>
        </div>

        {(["wcl", "wel", "wsl"] as const).map((league) => {
          const leagueGroups = allLeaguesData[league];
          const leagueName = league === "wcl" ? "Wano Continental League" : league === "wel" ? "Wano Evolution League" : "Wano Super League";

          const leagueMatches = leagueGroups.flatMap((g) => g.matches);

          const sortedMatches = [...leagueMatches].sort((a, b) => {
            const dateA = parseMatchDate(a.meta);
            const dateB = parseMatchDate(b.meta);

            if (dateA && dateB) return dateA.getTime() - dateB.getTime();
            if (dateA && !dateB) return -1;
            if (!dateA && dateB) return 1;
            return a.id.localeCompare(b.id);
          });

          const matchesByDate = sortedMatches.reduce(
            (acc, match) => {
              const matchDate = parseMatchDate(match.meta);
              const key = matchDate ? matchDate.toISOString().slice(0, 10) : "tbd";

              const bucket = acc.get(key);
              if (bucket) {
                bucket.matches.push(match);
                return acc;
              }

              acc.set(key, {
                key,
                date: matchDate,
                title: matchDate ? match.meta : "To Be Announced",
                matches: [match],
              });

              return acc;
            },
            new Map<
              string,
              {
                key: string;
                date: Date | null;
                title: string;
                matches: ScheduleMatch[];
              }
            >(),
          );

          const dateSections = Array.from(matchesByDate.values()).sort((a, b) => {
            if (a.date && b.date) return a.date.getTime() - b.date.getTime();
            if (a.date && !b.date) return -1;
            if (!a.date && b.date) return 1;
            return a.key.localeCompare(b.key);
          });

          return (
            <TabsContent key={league} value={league} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-white mb-1">{leagueName}</h2>
                <p className="text-gray-400 text-sm">{league === "wcl" ? "Group Stage Fixtures" : "Coming Soon"}</p>
              </div>

              <div className="space-y-6">
                {dateSections.map((section) => (
                  <Card
                    key={section.key}
                    className="group bg-white/5 border-white/10 backdrop-blur-sm transition-colors duration-200 hover:bg-white/10 hover:border-white/20"
                  >
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="w-9 sm:w-10 shrink-0 border-r border-white/10 bg-white/5 flex items-center justify-center transition-colors duration-200 group-hover:bg-white/10">
                          <div className="transform -rotate-90 whitespace-nowrap text-white font-semibold text-[10px] sm:text-xs transition-colors duration-200 group-hover:text-white">
                            {section.title}
                          </div>
                        </div>

                        <div className="flex-1 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-gray-400 text-xs font-semibold">{section.matches.length} matches</div>
                            {league !== "wcl" && (
                              <Badge className="w-fit bg-blue-500/20 border border-blue-400/30 text-blue-200 font-semibold px-3 py-1">Coming Soon</Badge>
                            )}
                          </div>

                          <div className="space-y-3">
                            {section.matches.map((match) => {
                              const groupLetter = match.id.charAt(0);
                              const homeInitials = match.home.slice(0, 2).toUpperCase();
                              const awayInitials = match.away.slice(0, 2).toUpperCase();
                              const isPast = (() => {
                                const d = parseMatchDate(match.meta);
                                return d && d < today;
                              })();

                              return (
                                <div
                                  key={match.id}
                                  className={`relative overflow-hidden rounded-xl border transition-all duration-300 will-change-transform before:pointer-events-none before:absolute before:inset-0 before:z-10 before:content-[''] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:-translate-x-full before:transition-transform before:duration-700 hover:before:translate-x-full hover:-translate-y-0.5 ${
                                    match.status === "coming-soon"
                                      ? "border-white/10 bg-white/5 opacity-60"
                                      : isPast
                                        ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                                  }`}
                                >
                                  {/* left accent stripe */}
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/60 via-emerald-400/30 to-transparent rounded-l-xl" />

                                  <div className="pl-4 pr-4 py-4">
                                    {/* top row: label + group + status */}
                                    <div className="flex items-center gap-2 mb-3">
                                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{match.label}</span>
                                      <span className="text-[10px] font-bold text-gray-600">·</span>
                                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Group {groupLetter}</span>
                                      <div className="ml-auto">
                                        {match.status === "coming-soon" ? (
                                          <Badge className="bg-blue-500/20 border border-blue-400/30 text-blue-200 font-semibold text-[10px] px-2 py-0.5">Coming Soon</Badge>
                                        ) : isPast ? (
                                          <Badge className="bg-gray-500/20 border border-gray-400/30 text-gray-300 font-semibold text-[10px] px-2 py-0.5">Completed</Badge>
                                        ) : (
                                          <Badge className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-semibold text-[10px] px-2 py-0.5 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            Scheduled
                                          </Badge>
                                        )}
                                      </div>
                                    </div>

                                    {/* teams row — grid keeps VS always centred */}
                                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                                      {/* home team */}
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="h-9 w-9 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                          <span className="text-white text-[11px] font-bold">{homeInitials}</span>
                                        </div>
                                        <span className="text-white font-bold text-sm truncate">{match.home}</span>
                                      </div>

                                      {/* vs badge */}
                                      <div className="flex items-center justify-center">
                                        <div className="h-7 w-7 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
                                          <span className="text-[10px] font-black text-gray-400 tracking-tight">VS</span>
                                        </div>
                                      </div>

                                      {/* away team */}
                                      <div className="flex items-center gap-2.5 min-w-0 justify-end">
                                        <span className="text-white font-bold text-sm truncate text-right">{match.away}</span>
                                        <div className="h-9 w-9 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                          <span className="text-white text-[11px] font-bold">{awayInitials}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
