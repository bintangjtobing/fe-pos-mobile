import { useState } from 'react';
import { ChevronLeft, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
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

// Interface for modal detail component props
interface ModalDetailProps {
  closeItemDetails: () => void;
  setItemQuantity: (quantity: number) => void;
  addToCart: () => void;
  formatPrice: (price: number) => string;
  item: MenuItem;
  itemQuantity: number;
}

export const ModalDetail = ({
  closeItemDetails,
  setItemQuantity,
  addToCart,
  formatPrice,
  item,
  itemQuantity,
}: ModalDetailProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddAnimation, setShowAddAnimation] = useState(false);

  // Function to handle adding to cart with animation
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // First show the success animation
    setShowAddAnimation(true);
    
    // After animation completes, call the actual addToCart function and reset states
    setTimeout(() => {
      addToCart();
      setIsAddingToCart(false);
      setShowAddAnimation(false);
    }, 1000); // Animation duration
  };

  return (
    <Sheet key={`sheet-${item.id}`}>
      <SheetTrigger asChild>
        <div className="bg-card rounded-lg shadow-md overflow-hidden flex cursor-pointer hover:shadow-lg transition-shadow">
          <div className="w-28 h-28 bg-muted flex items-center justify-center relative">
            <span className="text-muted-foreground">Image</span>
            {item.popular && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Populer
              </div>
            )}
          </div>
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-card-foreground">{item.name}</h3>
              <p className="text-primary font-bold">Rp {formatPrice(item.price)}</p>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <span className="bg-muted px-2 py-1 rounded-full">{item.category}</span>
              {item.nutritionInfo && <span className="ml-2">{item.nutritionInfo.calories} kal</span>}
            </div>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-xl p-0">
        <div className="sticky top-0 z-10 bg-card p-4 border-b flex items-center justify-between">
          <SheetClose className="p-1 rounded-full hover:bg-muted">
            <ChevronLeft className="w-6 h-6" />
          </SheetClose>
          <SheetTitle className="text-center">Detail Menu</SheetTitle>
          <div className="w-6"></div> {/* Spacer for centering the title */}
        </div>

        <div className="bg-background h-full overflow-y-auto pb-20">
          {/* Item image */}
          <div className="w-full h-64 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Image</span>
          </div>

          {/* Item details */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h1 className="text-xl font-bold">{item.name}</h1>
              <p className="text-primary font-bold text-lg">Rp {formatPrice(item.price)}</p>
            </div>

            <p className="text-muted-foreground mt-2">{item.description}</p>

            {item.ingredients && (
              <div className="mt-4">
                <h3 className="font-semibold text-sm">Bahan-bahan:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.ingredients.map((ingredient, index) => (
                    <span
                      key={`ingredient-${index}`}
                      className="bg-muted text-xs px-2 py-1 rounded-full text-muted-foreground"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.nutritionInfo && (
              <div className="mt-4">
                <h3 className="font-semibold text-sm">Informasi Nutrisi:</h3>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  <div className="bg-muted p-2 rounded-lg text-center">
                    <p className="text-sm font-medium">{item.nutritionInfo.calories}</p>
                    <p className="text-xs text-muted-foreground">Kalori</p>
                  </div>
                  <div className="bg-muted p-2 rounded-lg text-center">
                    <p className="text-sm font-medium">{item.nutritionInfo.protein}g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div className="bg-muted p-2 rounded-lg text-center">
                    <p className="text-sm font-medium">{item.nutritionInfo.carbs}g</p>
                    <p className="text-xs text-muted-foreground">Karbo</p>
                  </div>
                  <div className="bg-muted p-2 rounded-lg text-center">
                    <p className="text-sm font-medium">{item.nutritionInfo.fat}g</p>
                    <p className="text-xs text-muted-foreground">Lemak</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mt-6 flex items-center justify-between bg-muted p-2 rounded-lg">
              <span className="font-medium">Jumlah</span>
              <div className="flex items-center">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-card"
                  onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                  disabled={isAddingToCart}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium">{itemQuantity}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-card"
                  onClick={() => setItemQuantity(itemQuantity + 1)}
                  disabled={isAddingToCart}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to cart button with animation */}
            <button
              className={`w-full font-medium rounded-lg py-3 mt-6 flex items-center justify-center space-x-2 transition-all duration-300 relative 
                ${isAddingToCart 
                  ? 'bg-green-500 text-white' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <div className={`flex items-center justify-center space-x-2 transition-opacity duration-300 ${showAddAnimation ? 'opacity-0' : 'opacity-100'}`}>
                <ShoppingCart className="w-5 h-5" />
                <span>Tambahkan ke Keranjang - Rp {formatPrice(item.price * itemQuantity)}</span>
              </div>
              
              {/* Success animation elements */}
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 
                  ${showAddAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Check className="w-5 h-5" />
                  <span>Berhasil Ditambahkan!</span>
                </div>
              </div>
              
              {/* Add the flying animation when item is added to cart */}
              {showAddAnimation && (
                <div className="fixed z-50 animate-fly-to-cart">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};