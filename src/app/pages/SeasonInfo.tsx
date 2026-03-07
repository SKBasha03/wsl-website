import { Calendar, Clock, MapPin, CheckCircle2, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
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

function formatMatchDate(meta: string): { date: string; time: string } {
  // Input format: "Monday | March 09, 2026"
  const parts = meta.split("|").map((s) => s.trim());
  const datePart = parts[1] || parts[0];
  
  // For now, assign times based on pattern (you can enhance this)
  const times = ["19:00", "20:30", "18:00", "19:30"];
  const randomTime = times[Math.floor(Math.random() * times.length)];
  
  return {
    date: datePart,
    time: randomTime,
  };
}

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
          <CardContent className="space-y-4">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => {
                const { date, time } = formatMatchDate(match.meta);
                return (
                  <div
                    key={match.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>{date}</span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{match.home}</span>
                      <span className="text-gray-400 text-sm">vs</span>
                      <span className="text-white font-semibold text-right">{match.away}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span>Group {match.id.charAt(0)} Match</span>
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
