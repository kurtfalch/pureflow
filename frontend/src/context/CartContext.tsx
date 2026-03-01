import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
  productId: number;
  productName: string;
  packageType: 'single' | 'double' | 'triple' | 'subscription';
  packageLabel: string;
  quantity: number;
  unitPrice: number;
  originalPrice: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: number, packageType: string) => void;
  updateQuantity: (productId: number, packageType: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.productId === newItem.productId && i.packageType === newItem.packageType
      );
      if (existing) {
        return prev.map(i =>
          i.productId === newItem.productId && i.packageType === newItem.packageType
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((productId: number, packageType: string) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.packageType === packageType)));
  }, []);

  const updateQuantity = useCallback((productId: number, packageType: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, packageType);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.packageType === packageType
          ? { ...i, quantity }
          : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}