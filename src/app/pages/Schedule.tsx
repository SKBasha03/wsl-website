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
  const groupStageMatches = getAllScheduledMatches();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const completedMatches = groupStageMatches.filter((match) => {
    const matchDate = parseMatchDate(match.meta);
    return matchDate && matchDate < today;
  }).length;
  
  const upcomingMatches = groupStageMatches.filter((match) => {
    const matchDate = parseMatchDate(match.meta);
    return matchDate && matchDate >= today;
  }).length;
  
  // Total tournament matches: Group Stage (36) + WCL (15) + WEL (15) + WSL (1) = 67
  const totalMatches = 67;

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
          return (
            <TabsContent key={league} value={league} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-white mb-1">{leagueName}</h2>
                <p className="text-gray-400 text-sm">{league === "wcl" ? "Group Stage Fixtures" : "Coming Soon"}</p>
              </div>

              <div className="space-y-6">
                {leagueGroups.map((group) => (
                  <Card key={group.group} className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{group.group}</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold text-lg">Group {group.group}</div>
                          <div className="text-gray-400 text-xs">{group.matches.length} matches scheduled</div>
                        </div>
                      </div>

                      {league !== "wcl" && (
                        <Badge className="w-fit bg-blue-500/20 border border-blue-400/30 text-blue-200 font-semibold px-3 py-1">Coming Soon</Badge>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-2">
                      {group.matches.map((match) => (
                        <div
                          key={match.id}
                          className={`rounded-lg border px-4 py-3 transition-all duration-200 ${
                            match.status === "coming-soon"
                              ? "border-white/10 bg-white/5 opacity-60"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="text-xs text-gray-400 font-semibold">{match.label}</div>
                                {match.status === "coming-soon" ? (
                                  <Badge className="bg-blue-500/20 border border-blue-400/30 text-blue-200 font-semibold text-xs">Coming Soon</Badge>
                                ) : (
                                  <Badge className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-semibold text-xs flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                                    Scheduled
                                  </Badge>
                                )}
                              </div>

                              <div className="text-white text-base font-semibold truncate mb-1">
                                {match.home} <span className="text-gray-400 font-normal">vs</span> {match.away}
                              </div>
                              <div className="text-xs text-gray-400">{match.meta}</div>
                            </div>
                          </div>
                        </div>
                      ))}
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
