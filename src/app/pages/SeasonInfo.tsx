import { CheckCircle2, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { getNextDateMatches, parseMatchDate, getAllScheduledMatches } from "../lib/scheduleData";

type Milestone = {
  title: string;
  date: string;
  completed: boolean;
};

const seasonMilestones: Milestone[] = [
  {
    title: "Kickoff",
    date: "March 5, 2026",
    completed: true,
  },
  {
    title: "Free Agent Transfer Window Open",
    date: "March 5, 2026",
    completed: true,
  },
  {
    title: "Free Agent Transfer Window Close",
    date: "March 8, 2026",
    completed: false,
  },
  {
    title: "Group Stage Starts",
    date: "March 9, 2026",
    completed: false,
  },
  {
    title: "Group Stage Ends",
    date: "March 15, 2026",
    completed: false,
  },
  {
    title: "Club to Club Agents Transfer Window Open",
    date: "TBD",
    completed: false,
  },
  {
    title: "Club to Club Agents Transfer Window Close",
    date: "TBD",
    completed: false,
  },
  {
    title: "WCL KickOff",
    date: "TBD",
    completed: false,
  },
  {
    title: "WEL KickOff",
    date: "TBD",
    completed: false,
  },
  {
    title: "WCL Ends",
    date: "TBD",
    completed: false,
  },
  {
    title: "WEL Ends",
    date: "TBD",
    completed: false,
  },
  {
    title: "WSL Starts",
    date: "TBD",
    completed: false,
  },
  {
    title: "Title Winners Announce",
    date: "TBD",
    completed: false,
  },
  {
    title: "Season Ends",
    date: "TBD",
    completed: false,
  },
];

const currentWeek = 24;
const totalWeeks = 36;
const progressPercentage = Math.round((currentWeek / totalWeeks) * 100);

export function SeasonInfo() {
  // Get all matches from the next match date
  const upcomingMatches = getNextDateMatches();
  
  // Calculate actual season progress
  const groupStageMatches = getAllScheduledMatches();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const completedGroupMatches = groupStageMatches.filter((match) => {
    const matchDate = parseMatchDate(match.meta);
    return matchDate && matchDate < today;
  }).length;
  
  // Total tournament matches breakdown:
  // Group Stage: 36 matches
  // WCL (R16: 8, QF: 4, SF: 2, Final: 1) = 15 matches
  // WEL (R16: 8, QF: 4, SF: 2, Final: 1) = 15 matches
  // WSL (Grand Final: 1) = 1 match
  // Total: 67 matches
  const totalTournamentMatches = 67;
  const completedMatches = completedGroupMatches; // For now, only group stage matches are tracked
  
  const actualProgressPercentage = totalTournamentMatches > 0 
    ? Math.round((completedMatches / totalTournamentMatches) * 100)
    : progressPercentage;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-white mb-2">
          Season Information
        </h1>
        <p className="text-gray-400">Track your season progress and upcoming fixtures</p>
      </div>

      {/* Season Progress */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-white">Season Progress</CardTitle>
            <span className="text-sm text-gray-400">
              Week <span className="font-bold text-white">{currentWeek}</span> of {totalWeeks}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={actualProgressPercentage} className="h-3 mb-2" />
          <p className="text-center text-sm text-gray-400">
            {actualProgressPercentage}% Complete ({completedMatches} of {totalTournamentMatches} total matches played)
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Matches */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold text-white">Upcoming Matches</CardTitle>
            <Link to="/schedule">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => {
                const groupLetter = match.id.charAt(0);
                const homeInitials = match.home.slice(0, 2).toUpperCase();
                const awayInitials = match.away.slice(0, 2).toUpperCase();
                return (
                  <div
                    key={match.id}
                    className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 will-change-transform before:pointer-events-none before:absolute before:inset-0 before:z-10 before:content-[''] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:-translate-x-full before:transition-transform before:duration-700 hover:before:translate-x-full hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5"
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
                          <Badge className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-semibold text-[10px] px-2 py-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Scheduled
                          </Badge>
                        </div>
                      </div>

                      {/* teams row */}
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-9 w-9 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                            <span className="text-white text-[11px] font-bold">{homeInitials}</span>
                          </div>
                          <span className="text-white font-bold text-sm truncate">{match.home}</span>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="h-7 w-7 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
                            <span className="text-[10px] font-black text-gray-400 tracking-tight">VS</span>
                          </div>
                        </div>

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
              })
            ) : (
              <p className="text-center text-gray-400 py-8">No upcoming matches scheduled</p>
            )}
          </CardContent>
        </Card>

        {/* Season Milestones */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold text-white">Season Milestones</CardTitle>
            <Link to="/fixture">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                View Bracket
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-white/10"></div>

              <div className="space-y-6">
                {seasonMilestones.map((milestone, index) => (
                  <div key={index} className="relative flex gap-4">
                    {/* Timeline dot */}
                    <div
                      className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                        milestone.completed
                          ? "bg-emerald-500/20 border-emerald-500"
                          : "bg-white/5 border-white/20"
                      }`}
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Trophy className="h-4 w-4 text-gray-400" />
                      )}
                    </div>

                    {/* Milestone content */}
                    <div className="flex-1 pb-6">
                      <h4
                        className={`font-semibold mb-1 ${
                          milestone.completed ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-gray-400">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
