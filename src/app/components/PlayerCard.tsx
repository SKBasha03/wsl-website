import { ShoppingCart, Check } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Player, useCart } from "../context/CartContext";
import { toast } from "sonner";

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const { cart, addToCart } = useCart();
  const isInCart = cart.some(p => p.id === player.id);
  const isSoldOut = Boolean(player.soldOut);
  const isInAuction = Boolean(player.inAuction);
  const isUnavailable = isSoldOut || isInAuction;
  const showSoldOutStyling = isSoldOut && !isInCart;
  const showAuctionStyling = isInAuction && !isInCart;
  const isLocalCardImage = !/^https?:\/\//i.test(player.image);

  const cardGradient = showAuctionStyling
    ? "from-emerald-900/40 via-emerald-950/30 to-black/90"
    : "from-white/10 via-white/5 to-white/10";

  const handleAddToCart = () => {
    if (isSoldOut) {
      toast.error(`${player.name} is unavailable.`);
      return;
    }

    if (isInAuction) {
      toast.error(`${player.name} is currently in auction.`);
      return;
    }
    if (!isInCart) {
      addToCart(player);
      toast.success(`${player.name} added to squad!`);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "from-white via-zinc-200 to-zinc-400";
    if (rating >= 85) return "from-zinc-200 via-zinc-400 to-zinc-600";
    if (rating >= 80) return "from-zinc-300 via-zinc-500 to-zinc-700";
    return "from-zinc-500 via-zinc-700 to-zinc-900";
  };

  const getRatingBorder = (rating: number) => {
    if (rating >= 90) return "border-white/60";
    if (rating >= 85) return "border-white/40";
    if (rating >= 80) return "border-white/30";
    return "border-white/20";
  };

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

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${cardGradient} backdrop-blur-md shadow-2xl transition-all duration-300 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-white/10 before:-z-10 ${
        showSoldOutStyling
          ? "opacity-60 grayscale border-white/10"
          : showAuctionStyling
            ? "border-emerald-400/40 shadow-emerald-500/20"
            : "border-white/20 hover:border-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
      }`}
      style={{ contentVisibility: "auto", containIntrinsicSize: "360px 520px" }}
    >
      <div className={`relative overflow-hidden ${isLocalCardImage ? "h-72" : "h-48"}`}>
        <img 
          src={player.image} 
          alt={player.name}
          loading="lazy"
          decoding="async"
          className={`w-full h-full ${isLocalCardImage ? "object-contain bg-black" : "object-cover"}`}
        />
        {!isLocalCardImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3">
          <div className={`relative bg-gradient-to-br ${getRatingColor(player.rating)} p-[2px] rounded-xl shadow-lg`}> 
            <div className={`bg-black/95 backdrop-blur-sm rounded-xl px-3.5 py-2.5 flex flex-col items-center justify-center min-w-[3.5rem] border ${getRatingBorder(player.rating)}`}>
              <span className="text-2xl font-black text-white leading-none">{player.rating}</span>
              <span className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">OVR</span>
            </div>
          </div>
        </div>

        {/* Position Badge */}
        <Badge className={`absolute top-3 right-3 ${getPositionColor(player.position)} border-2 border-white/30 text-white font-bold shadow-lg`}>
          {player.position}
        </Badge>

        {/* Sold Out */}
        {showSoldOutStyling && (
          <>
            <div className="absolute inset-0 bg-black/60" />
            <Badge className="absolute bottom-3 left-3 bg-black/80 border-2 border-white/30 text-white font-bold shadow-xl">
              Unavailable
            </Badge>
          </>
        )}

        {/* In Auction */}
        {showAuctionStyling && (
          <Badge className="absolute bottom-3 left-3 bg-gradient-to-r from-emerald-500/30 to-green-500/30 border-2 border-emerald-400/50 text-emerald-100 font-bold shadow-xl">
            In Auction
          </Badge>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="font-black text-white text-xl mb-1.5">{player.name}</h3>
          <div className="text-sm text-gray-300 font-medium">
            {player.club}{player.nationality ? ` (${player.nationality})` : ""}
          </div>
          <div className="text-base text-white font-bold mt-1">{player.price}</div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isInCart || (isUnavailable && !isInCart)}
          className={`w-full h-11 font-bold shadow-lg transition-all duration-200 ${
            isInCart
              ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-600 hover:to-gray-700 cursor-not-allowed border-0"
              : showSoldOutStyling
                ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-600 hover:to-gray-700 cursor-not-allowed border-0"
                : showAuctionStyling
                  ? "bg-gradient-to-r from-emerald-600/40 to-green-600/40 text-emerald-100 hover:from-emerald-600/40 hover:to-green-600/40 cursor-not-allowed border-emerald-400/30"
                  : "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95 shadow-none"
          }`}
        >
          {isInCart ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              In Squad
            </>
          ) : isSoldOut ? (
            <>Unavailable</>
          ) : isInAuction ? (
            <>In Auction</>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Squad
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}