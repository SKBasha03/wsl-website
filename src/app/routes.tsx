import { Navigate, createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { FreeAgents } from "./pages/FreeAgents";
import { Layout } from "./components/Layout";
import { Auth } from "./pages/Auth";
import { Schedule } from "./pages/Schedule";
import { Fixture } from "./pages/Fixture";
import { SeasonInfo } from "./pages/SeasonInfo";
import { Transfers } from "./pages/Transfers";

function LeagueRedirect() {
  return <Navigate to="/" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "league", Component: LeagueRedirect },
      { path: "schedule", Component: Schedule },
      { path: "fixture", Component: Fixture },
      { path: "season-info", Component: SeasonInfo },
      { path: "free-agents", Component: FreeAgents },
      { path: "transfers", Component: Transfers },
      { path: "auth", Component: Auth },
    ],
  },
]);
