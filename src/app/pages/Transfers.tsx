import { ArrowLeftRight, Clock, CheckCircle2, XCircle, User, Users, ArrowRightLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Link } from "react-router";

type TransferStatus = "completed" | "pending" | "cancelled";

type Transfer = {
  id: string;
  player: string;
  from: string;
  to: string;
  date: string;
  status: TransferStatus;
  type: "Permanent" | "Loan";
};

// Free Agent signings (player was unattached → signed by a club)
const freeAgentTransfers: Transfer[] = [
  // Add free agent transfers here
];

// Club-to-Club transfers (player moves between two clubs)
const clubToClubTransfers: Transfer[] = [
  // Add club-to-club transfers here
];

const statusConfig: Record<
  TransferStatus,
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  completed: {
    label: "Completed",
    badgeClass:
      "bg-emerald-500/20 border border-emerald-400/30 text-emerald-200",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  pending: {
    label: "Pending",
    badgeClass: "bg-yellow-500/20 border border-yellow-400/30 text-yellow-200",
    icon: <Clock className="h-3 w-3" />,
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-red-500/20 border border-red-400/30 text-red-300",
    icon: <XCircle className="h-3 w-3" />,
  },
};

const completed = [...freeAgentTransfers, ...clubToClubTransfers].filter((t) => t.status === "completed").length;
const pending = [...freeAgentTransfers, ...clubToClubTransfers].filter((t) => t.status === "pending").length;

export function Transfers() {
  const totalTransfers = freeAgentTransfers.length + clubToClubTransfers.length;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Transfer Window
        </h1>
        <p className="text-gray-400">
          Player movements across all Wano Super League clubs
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-400">Total Transfers</CardTitle>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <ArrowLeftRight className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{totalTransfers}</div>
            <p className="text-sm text-gray-400">This Window</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-400">Completed</CardTitle>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{completed}</div>
            <p className="text-sm text-gray-400">Confirmed Deals</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-400">Pending</CardTitle>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{pending}</div>
            <p className="text-sm text-gray-400">Awaiting Confirmation</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="free-agents" className="space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/free-agents" target="_blank" rel="noopener noreferrer">
            <Button className="border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-200 hover:scale-105 active:scale-95 hover:border-white/30 flex items-center gap-2">
              Browse Free Agents
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex-1 flex justify-center">
            <TabsList className="bg-white/5 border border-white/10 p-1 h-12 rounded-lg">
              <TabsTrigger
                value="free-agents"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 font-semibold px-6 h-9 rounded-md transition-all duration-200 flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Free Agents
              </TabsTrigger>
              <TabsTrigger
                value="club-to-club"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 font-semibold px-6 h-9 rounded-md transition-all duration-200 flex items-center gap-2"
              >
                <ArrowRightLeft className="h-4 w-4" />
                Club — Club
              </TabsTrigger>
            </TabsList>
          </div>

          {/* spacer to balance the left button */}
          <div className="invisible">
            <Button className="flex items-center gap-2">Browse Free Agents <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>

        <TabsContent value="free-agents">
          <TransferList transfers={freeAgentTransfers} emptyLabel="No free agent signings yet" />
        </TabsContent>

        <TabsContent value="club-to-club">
          <TransferList transfers={clubToClubTransfers} emptyLabel="No club-to-club transfers yet" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TransferList({ transfers, emptyLabel }: { transfers: Transfer[]; emptyLabel: string }) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardContent className="pt-6">
        {transfers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <ArrowLeftRight className="h-7 w-7 text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm font-medium">{emptyLabel}</p>
            <p className="text-gray-600 text-xs">Transfer activity will appear here once the window opens</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transfers.map((transfer) => {
              const fromInitials = transfer.from.slice(0, 2).toUpperCase();
              const toInitials = transfer.to.slice(0, 2).toUpperCase();
              const cfg = statusConfig[transfer.status];

              return (
                <div
                  key={transfer.id}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 will-change-transform before:pointer-events-none before:absolute before:inset-0 before:z-10 before:content-[''] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:-translate-x-full before:transition-transform before:duration-700 hover:before:translate-x-full hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/40 via-white/20 to-transparent rounded-l-xl" />

                  <div className="pl-4 pr-4 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-white/10 border border-white/20 text-gray-300 font-semibold text-[10px] px-2 py-0.5">
                        {transfer.type}
                      </Badge>
                      <span className="text-[10px] font-bold text-gray-600">·</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{transfer.date}</span>
                      <div className="ml-auto">
                        <Badge className={`${cfg.badgeClass} font-semibold text-[10px] px-2 py-0.5 flex items-center gap-1`}>
                          {cfg.icon}
                          {cfg.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-9 w-9 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                          <span className="text-white text-[11px] font-bold">{fromInitials}</span>
                        </div>
                        <span className="text-white font-bold text-sm truncate">{transfer.from}</span>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="h-10 w-10 rounded-full bg-white/5 border-2 border-white/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 truncate max-w-[80px] text-center">{transfer.player}</span>
                      </div>

                      <div className="flex items-center gap-2.5 min-w-0 justify-end">
                        <span className="text-white font-bold text-sm truncate text-right">{transfer.to}</span>
                        <div className="h-9 w-9 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                          <span className="text-white text-[11px] font-bold">{toInitials}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
