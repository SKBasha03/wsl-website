import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Trophy, Users, Calendar, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getAllScheduledMatches, parseMatchDate } from "../lib/scheduleData";

export function Home() {
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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-white mb-4">
          Welcome to Wano Super League
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl">
          Build your ultimate squad from our free agents marketplace. Discover top talent across all positions and create your dream team.
        </p>
        <Link to="/free-agents">
          <Button size="lg" className="bg-white/10 hover:bg-white/15 text-white border border-white/10">
            Browse Free Agents
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Total Matches</p>
                <p className="text-xs text-gray-400 font-normal mt-0.5">Entire tournament</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white mb-1">{totalMatches}</p>
            <p className="text-gray-400 text-sm">All Stages Combined</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Completed Matches</p>
                  <p className="text-xs text-gray-400 font-normal mt-0.5">Matches played</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white mb-1">{completedMatches}</p>
              <p className="text-gray-400 text-sm">Finished</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Upcoming Matches</p>
                  <p className="text-xs text-gray-400 font-normal mt-0.5">Scheduled matches</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white mb-1">{upcomingMatches}</p>
              <p className="text-gray-400 text-sm">To Be Played</p>
            </CardContent>
          </Card>
        </div>

      {/* Featured Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Get Started</h2>
          <p className="text-gray-400">Everything you need to build your ultimate squad</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-white">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Browse Free Agents</h4>
                  <p className="text-gray-400 text-sm">
                    Explore players by position - Goalkeepers, Defenders, Midfielders, and Forwards
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Add to Your Squad</h4>
                  <p className="text-gray-400 text-sm">
                    Select your favorite players and add them to your cart
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Share Your Team</h4>
                  <p className="text-gray-400 text-sm">
                    Copy your squad list and share it with league members
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}