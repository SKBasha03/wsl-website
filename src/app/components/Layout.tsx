import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();
  const { user, logOut } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getPositionColor = (position: string) => {
    switch (position) {
      case "Goalkeeper":
      case "Defender":
      case "Midfielder":
      case "Forward":
        return "bg-white/10";
      default:
        return "bg-white/10";
    }
  };

  const handleShare = () => {
    const playerNames = cart.map(p => `${p.name} (${p.position})`).join('\n');
    const shareText = `My Wano Super League Squad:\n\n${playerNames}\n\nTotal Players: ${cart.length}`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success("Squad copied to clipboard!");
    });
  };

  const handleLogout = async () => {
    try {
      await logOut();
      clearCart();
      toast.success("Logged out");
      navigate("/", { replace: true });
    } catch {
      toast.error("Could not log out. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black">
      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/85 backdrop-blur-2xl border-b border-white/30 shadow-[0_4px_24px_0_rgba(255,255,255,0.07)]"
            : "bg-black/50 backdrop-blur-xl border-b border-white/20 shadow-[0_2px_16px_0_rgba(255,255,255,0.05)]"
        }`}
      >
        {/* Top shimmer accent line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center transition-all duration-500 ${scrolled ? "h-14" : "h-16"}`}>

            {/* Logo */}
            <Link to="/" className="group flex items-center gap-2 font-bold text-white transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/15 blur-2xl scale-[2.5] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <img
                  src="/logo.png"
                  alt="Wano Super League"
                  className={`object-contain transition-all duration-500 group-hover:scale-110 w-auto ${scrolled ? "h-14" : "h-20"}`}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-2xl transition-all duration-300 group-hover:tracking-wider">
                  Wano{" "}
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    Super League
                  </span>
                </span>
                <span className="text-[9px] font-medium tracking-[0.2em] text-white/30 uppercase group-hover:text-white/50 transition-colors duration-300">
                  Season 1 · 2025/26
                </span>
              </div>
            </Link>

            <div className="ml-auto flex items-center gap-4">
              <div className="flex gap-1">
                {([
                  { to: "/", label: "HOME" },
                  { to: "/transfers", label: "TRANSFERS" },
                ] as const).map(({ to, label }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link key={to} to={to}>
                      <Button
                        variant="ghost"
                        className={`relative overflow-hidden text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95
                          before:content-[''] before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full
                          ${
                            isActive
                              ? "bg-white/10 text-white border border-white/20 shadow-md shadow-white/5"
                              : "text-gray-400 hover:text-white border border-transparent hover:border-white/15 hover:bg-white/5"
                          }`}
                      >
                        {label}
                        {isActive && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-4/5 rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 border-2 border-white/30 bg-gradient-to-br from-white/10 to-white/5 shadow-lg">
                    <AvatarImage
                      src={user.photoURL ?? undefined}
                      alt={user.displayName ?? "Profile"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-white/10 text-white text-xs font-bold">
                      {(user.displayName ?? user.email ?? "U").trim().slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="border border-white/20 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Log out
                  </Button>
                </div>
              ) : null}

              {/* Cart (Free Agents only) */}
              {location.pathname === "/free-agents" && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="relative border border-white/20 bg-white/5 hover:bg-white/15 text-white transition-all duration-200 hover:scale-105 active:scale-95">
                      <ShoppingCart className="h-5 w-5" />
                      {cart.length > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0 font-bold shadow-lg shadow-purple-500/30">
                          {cart.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border-white/20 text-white shadow-2xl backdrop-blur-xl">
                    <div className="flex h-full flex-col">
                      <SheetHeader className="border-b border-white/10 pb-4">
                        <SheetTitle className="text-white text-2xl font-black">Your Squad ({cart.length})</SheetTitle>
                      </SheetHeader>

                      {cart.length === 0 ? (
                        <div className="mt-6 flex-1">
                          <p className="text-gray-400 text-center py-8">No players selected</p>
                        </div>
                      ) : (
                        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-4">
                          <ScrollArea type="auto" className="min-h-0 flex-1">
                            <div className="space-y-4 pr-4">
                              {cart.map((player) => (
                                <div
                                  key={player.id}
                                  className="relative flex items-center gap-3 p-3 bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-xl border border-white/20 shadow-lg hover:scale-105 transition-all duration-200 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-white/10 before:-z-10"
                                >
                                  <img
                                    src={player.image}
                                    alt={player.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-md"
                                    loading="lazy"
                                    decoding="async"
                                    fetchPriority="low"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-base">{player.name}</p>
                                      <Badge
                                        className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-white/20 text-white text-xs font-semibold"
                                      >
                                        {player.position}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-300 mt-0.5">Rating: {player.rating}</p>
                                    <p className="text-sm text-white font-semibold mt-1">{player.price}</p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromCart(player.id)}
                                    className="text-gray-300 hover:text-white hover:bg-white/10 font-semibold"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>

                          <div className="space-y-2 pt-4 border-t border-white/10">
                            <Button onClick={handleShare} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20 border-0 font-bold">
                              Copy Squad
                            </Button>
                            <Button
                              onClick={clearCart}
                              variant="outline"
                              className="w-full border-white/30 text-white hover:bg-white/10 font-semibold"
                            >
                              Clear All
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}