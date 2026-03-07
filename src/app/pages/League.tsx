import {
  Calendar,
  ClipboardList,
  Goal,
  Globe,
  ShieldCheck,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const points = [
  { place: "1st", value: 25 },
  { place: "2nd", value: 18 },
  { place: "3rd", value: 15 },
  { place: "4th", value: 12 },
  { place: "5th", value: 10 },
  { place: "6th", value: 8 },
  { place: "7th", value: 6 },
  { place: "8th", value: 4 },
  { place: "9th", value: 2 },
  { place: "10th", value: 1 },
];

const coreValues = [
  {
    title: "Excellence",
    description: "We set high standards in every match — preparation, teamwork, and performance.",
    Icon: Trophy,
    iconBg: "bg-white/10",
    iconColor: "text-white",
  },
  {
    title: "Community",
    description: "A competitive league built on respect, fair play, and shared passion.",
    Icon: Users,
    iconBg: "bg-white/10",
    iconColor: "text-white",
  },
  {
    title: "Innovation",
    description: "We keep improving formats and rules to make the league more fun and fair.",
    Icon: Globe,
    iconBg: "bg-white/10",
    iconColor: "text-white",
  },
];

const history = [
  {
    year: "2024",
    title: "Foundation Year",
    description:
      "Wano Super League began as a small community competition with a simple goal: build the best squads and play great matches.",
  },
  {
    year: "2025",
    title: "Growth & Expansion",
    description:
      "More teams joined, formats improved, and the season structure became more competitive with clear rules and standings.",
  },
  {
    year: "2026",
    title: "Current Season",
    description:
      "The league now focuses on consistency, fair points, and an active transfer market through Free Agents.",
  },
];

export function League() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-white mb-3">League Information</h1>
        <p className="text-gray-300 text-lg">
          Discover the mission, values, and structure of the Wano Super League
        </p>
      </div>

      {/* Mission */}
      <Card className="bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-800/60 border-white/10 overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <Goal className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed max-w-4xl">
                To create a competitive and welcoming football league where strategy, skill, and teamwork come together —
                giving every manager a fair shot at building a champion squad.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Values */}
      <div className="mt-14">
        <h2 className="text-4xl font-bold text-white mb-6">Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map(({ title, description, Icon, iconBg, iconColor }) => (
            <Card
              key={title}
              className="bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-4 text-white">
                  <div className={`p-3 rounded-lg ${iconBg} border border-white/10`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Championship Structure */}
      <div className="mt-16">
        <h2 className="text-4xl font-bold text-white mb-6">Championship Structure</h2>

        <Card className="bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              Season Format
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Each season is made up of scheduled matchdays. Teams compete for points, climbing the table through consistent
              results.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Multiple match rounds across the season</li>
              <li>Points awarded each matchday based on results</li>
              <li>Separate recognition for top teams and top performers</li>
              <li>Clear rules for squad building via Free Agents</li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <Star className="h-6 w-6 text-white" />
                </div>
                Points System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {points.map(({ place, value }) => (
                  <div
                    key={place}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
                  >
                    <div className="text-sm text-gray-300">{place}</div>
                    <div className="text-3xl font-bold text-white leading-tight mt-1">{value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                Team Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p className="mb-4">
                Teams must meet a few basic requirements to keep the league fair and enjoyable for everyone.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Maintain an active squad (add/remove players responsibly)</li>
                <li>Follow league rules for transfers and roster limits</li>
                <li>Respect fair play and scheduling expectations</li>
                <li>Participate consistently across the season</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              Match Rules (Overview)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-2">
            <p>Simple, transparent rules keep the competition clear:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Results determine points, points determine ranking</li>
              <li>Ties are resolved by standard table tiebreakers (e.g., goal difference)</li>
              <li>Managers must respect any agreed league settings</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <div className="mt-16">
        <h2 className="text-4xl font-bold text-white mb-6">Our History</h2>
        <div className="space-y-5">
          {history.map(({ year, title, description }) => (
            <Card key={year} className="bg-white/5 border border-white/10">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-8 items-start">
                  <div className="text-white font-bold text-2xl md:text-xl">{year}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-300 leading-relaxed">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
