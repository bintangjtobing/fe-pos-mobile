import React from 'react';

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

// Props interface for the menu card
interface MenuCardProps {
  item: MenuItem;
  formatPrice: (price: number) => string;
  onClick: () => void;
  isPopular?: boolean;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  formatPrice,
  onClick,
  isPopular = false
}) => {
  return (
    <div 
      className="bg-card rounded-lg shadow-md overflow-hidden flex cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
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
  );
};

// Popular menu card component with horizontal layout
export const PopularMenuCard: React.FC<MenuCardProps> = ({
  item,
  formatPrice,
  onClick
}) => {
  return (
    <div 
      className="flex-shrink-0 w-48 bg-card rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="w-full h-32 bg-muted flex items-center justify-center relative">
        <span className="text-muted-foreground">Image</span>
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
          Populer
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-card-foreground">{item.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
        <p className="text-primary text-sm font-bold mt-1">Rp {formatPrice(item.price)}</p>
      </div>
    </div>
  );
};