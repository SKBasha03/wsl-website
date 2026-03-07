import { createContext, useContext, useState, ReactNode } from "react";

export interface Player {
  id: string;
  name: string;
  position: string;
  rating: number;
  image: string;
  nationality: string;
  club: string;
  price: string;
  soldOut?: boolean;
  inAuction?: boolean;
}

interface CartContextType {
  cart: Player[];
  addToCart: (player: Player) => void;
  removeFromCart: (playerId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Player[]>([]);

  const addToCart = (player: Player) => {
    if (player.soldOut || player.inAuction) return;
    setCart((prev) => {
      // Check if player already in cart
      if (prev.find(p => p.id === player.id)) {
        return prev;
      }
      return [...prev, player];
    });
  };

  const removeFromCart = (playerId: string) => {
    setCart((prev) => prev.filter(p => p.id !== playerId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
