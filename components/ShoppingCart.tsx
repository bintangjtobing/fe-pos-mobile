'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

// Interface for nutrition information
interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Interface for menu item
interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  popular: boolean;
  ingredients?: string[];
  nutritionInfo?: NutritionInfo;
}

// Interface for cart item
interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  formatPrice: (price: number) => string;
  updateItemQuantity: (itemId: number, newQuantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
}

export const Cart = ({
  cartItems,
  formatPrice,
  updateItemQuantity,
  removeItem,
  clearCart
}: CartProps) => {
  const totalItems = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  const subtotal = cartItems.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  
  // delivery fee and other calculated costs
  const deliveryFee = subtotal > 0 ? 10000 : 0;
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const total = subtotal + deliveryFee + tax;

  // Determine if checkout button should be enabled
  const isCheckoutEnabled = cartItems.length > 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex flex-col items-center px-3 py-1 text-muted-foreground relative">
          <ShoppingBag className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="text-xs">Keranjang</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="border-b p-4 sticky top-0 bg-card z-10">
            <div className="flex items-center">
              <SheetClose className="p-1 mr-2 rounded-full hover:bg-muted flex items-center justify-center">
                <ChevronLeft className="w-5 h-5" />
              </SheetClose>
              <SheetTitle>Keranjang Belanja</SheetTitle>
              <div className="flex-1 flex justify-end">
                {cartItems.length > 0 && (
                  <button 
                    onClick={clearCart}
                    className="text-xs text-muted-foreground hover:text-destructive flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Kosongkan</span>
                  </button>
                )}
              </div>
            </div>
          </SheetHeader>

          {/* Empty Cart State */}
          {cartItems.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Keranjang Kosong</h3>
              <p className="text-muted-foreground mt-2">
                Anda belum menambahkan menu apapun ke keranjang belanja.
              </p>
              <SheetClose className="mt-6 px-4 py-2 bg-muted hover:bg-secondary text-foreground rounded-lg flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Menu</span>
              </SheetClose>
            </div>
          )}

          {/* Cart Items */}
          {cartItems.length > 0 && (
            <div className="flex-1 overflow-auto">
              <ul className="divide-y">
                {cartItems.map((cartItem) => (
                  <li key={`cart-item-${cartItem.item.id}`} className="p-4">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-muted-foreground text-xs">Image</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{cartItem.item.name}</h4>
                          <button 
                            onClick={() => removeItem(cartItem.item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-primary text-sm font-medium mt-1">
                          Rp {formatPrice(cartItem.item.price)}
                        </p>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border rounded-md">
                            <button 
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                              onClick={() => updateItemQuantity(cartItem.item.id, Math.max(1, cartItem.quantity - 1))}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-2 text-sm">{cartItem.quantity}</span>
                            <button 
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                              onClick={() => updateItemQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-medium">
                            Rp {formatPrice(cartItem.item.price * cartItem.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 bg-card">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rp {formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Biaya Pengiriman</span>
                  <span>Rp {formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pajak (10%)</span>
                  <span>Rp {formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Rp {formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <SheetClose className="rounded-lg py-3 bg-muted text-foreground hover:bg-secondary flex items-center justify-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </SheetClose>
                
                <button 
                  className={`rounded-lg py-3 flex items-center justify-center space-x-2 
                    ${isCheckoutEnabled 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
                  disabled={!isCheckoutEnabled}
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}