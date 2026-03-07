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
      <nav className="bg-gradient-to-r from-black/60 via-purple-950/20 to-black/60 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white hover:opacity-80 transition-opacity">
                <img
                  src="/logo.png"
                  alt="Wano Super League"
                  className="h-20 w-15 object-contain"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
                <span>
                  Wano <span className="text-gray-200">Super League</span>
                </span>
              </Link>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex gap-1">
                {([
                  { to: "/", label: "Home" },
                  { to: "/free-agents", label: "Free Agents" },
                ] as const).map(({ to, label }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link key={to} to={to}>
                      <Button
                        variant="ghost"
                        className={`relative font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                          isActive
                            ? "bg-white/10 text-white border border-white/20 shadow-inner after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-4/5 after:rounded-full after:bg-white/60 after:content-['']"
                            : "text-gray-400 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10"
                        }`}
                      >
                        {label}
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
                    <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-white text-xs font-bold">
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
              ) : (
                <Link to={`/auth?redirect=${encodeURIComponent(location.pathname || "/")}`}>
                  <Button className="border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold shadow-md transition-all duration-200 hover:scale-105 active:scale-95 hover:border-white/30">
                    Log in
                  </Button>
                </Link>
              )}

              {/* Cart (Free Agents only) */}
              {location.pathname === "/free-agents" && user && (
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