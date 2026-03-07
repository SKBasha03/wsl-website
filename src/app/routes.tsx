import { Navigate, createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { FreeAgents } from "./pages/FreeAgents";
import { Layout } from "./components/Layout";
import { Auth } from "./pages/Auth";
import { Fixture } from "./pages/Fixture";
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
      { path: "schedule", Component: LeagueRedirect },
      { path: "fixture", Component: Fixture },
      { path: "season-info", Component: LeagueRedirect },
      { path: "free-agents", Component: FreeAgents },
      { path: "transfers", Component: Transfers },
      { path: "auth", Component: Auth },
    ],
  },
]);
