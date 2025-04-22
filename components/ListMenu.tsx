'use client';

import { useState, useEffect } from 'react';
import { Search, Home, Menu as MenuIcon, User, ShoppingBag } from 'lucide-react';
import { ModalDetail } from './ModalDetail/Modal';
import { PopularMenuCard } from './MenuCard';
import { Cart } from './ShoppingCart';

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

// Helper untuk memformat harga dengan cara yang sama di server dan client
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID').format(price);
};

export default function Menu() {
  // Sample menu data - in a real app this would come from an API
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: 'Nasi Goreng Spesial',
      category: 'Main Course',
      price: 35000,
      description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
      image: '/placeholder.jpg',
      popular: true,
      ingredients: ['Nasi', 'Telur', 'Ayam', 'Sayuran', 'Bumbu rahasia'],
      nutritionInfo: {
        calories: 450,
        protein: 15,
        carbs: 65,
        fat: 12
      }
    },
    {
      id: 2,
      name: 'Mie Goreng',
      category: 'Main Course',
      price: 30000,
      description: 'Mie goreng dengan bumbu khas dan sayuran',
      image: '/placeholder.jpg',
      popular: false,
      ingredients: ['Mie', 'Telur', 'Sayuran', 'Bumbu khas'],
      nutritionInfo: {
        calories: 410,
        protein: 12,
        carbs: 60,
        fat: 14
      }
    },
    {
      id: 3,
      name: 'Sate Ayam',
      category: 'Appetizer',
      price: 25000,
      description: 'Sate ayam dengan bumbu kacang',
      image: '/placeholder.jpg',
      popular: true,
      ingredients: ['Ayam', 'Bumbu marinasi', 'Saus kacang', 'Lontong'],
      nutritionInfo: {
        calories: 320,
        protein: 25,
        carbs: 20,
        fat: 15
      }
    },
    {
      id: 4,
      name: 'Es Teh Manis',
      category: 'Beverages',
      price: 8000,
      description: 'Teh manis dingin segar',
      image: '/placeholder.jpg',
      popular: false,
      ingredients: ['Teh', 'Gula', 'Es batu'],
      nutritionInfo: {
        calories: 120,
        protein: 0,
        carbs: 30,
        fat: 0
      }
    },
    {
      id: 5,
      name: 'Jus Alpukat',
      category: 'Beverages',
      price: 15000,
      description: 'Jus alpukat segar dengan susu',
      image: '/placeholder.jpg',
      popular: true,
      ingredients: ['Alpukat', 'Susu', 'Gula', 'Es batu'],
      nutritionInfo: {
        calories: 240,
        protein: 4,
        carbs: 22,
        fat: 15
      }
    },
    {
      id: 6,
      name: 'Ayam Goreng',
      category: 'Main Course',
      price: 28000,
      description: 'Ayam goreng renyah dengan sambal',
      image: '/placeholder.jpg',
      popular: false,
      ingredients: ['Ayam', 'Bumbu rempah', 'Sambal', 'Lalapan'],
      nutritionInfo: {
        calories: 380,
        protein: 28,
        carbs: 15,
        fat: 22
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartBadgeAnimation, setCartBadgeAnimation] = useState(false);
  
  // Get unique categories
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];
  
  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Function to open menu item details
  const openItemDetails = (itemId: number) => {
    setSelectedItemId(itemId);
    setItemQuantity(1);
  };

  // Function to close menu item details
  const closeItemDetails = () => {
    setSelectedItemId(null);
    setItemQuantity(1);
  };

  // Function to add item to cart
  const addToCart = (item: MenuItem) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.item.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += itemQuantity;
      setCartItems(updatedCartItems);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { item, quantity: itemQuantity }]);
    }
    
    // Trigger cart badge animation
    setCartBadgeAnimation(true);
    
    // Close the detail modal after animation
    setTimeout(() => {
      closeItemDetails();
    }, 800);
  };

  // Reset animation state after it completes
  useEffect(() => {
    if (cartBadgeAnimation) {
      const timer = setTimeout(() => {
        setCartBadgeAnimation(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [cartBadgeAnimation]);

  // Function to update item quantity in cart
  const updateItemQuantity = (itemId: number, newQuantity: number) => {
    const updatedCartItems = cartItems.map(cartItem => 
      cartItem.item.id === itemId 
        ? { ...cartItem, quantity: newQuantity } 
        : cartItem
    );
    setCartItems(updatedCartItems);
  };

  // Function to remove item from cart
  const removeItem = (itemId: number) => {
    const updatedCartItems = cartItems.filter(cartItem => cartItem.item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  // Function to clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items in cart
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with restaurant info */}
      <header className="bg-card shadow-sm p-4 sticky top-0 z-10">
        <div className="text-center">
          <h1 className="text-xl font-bold text-card-foreground">Restoran Nusantara</h1>
          <p className="text-sm text-muted-foreground">Jl. Sudirman No. 123, Jakarta</p>
        </div>
        
        {/* Search bar */}
        <div className="mt-4 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari menu..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Category tabs */}
      <div className="overflow-x-auto sticky top-24 bg-card shadow-sm z-10">
        <div className="flex p-2 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 mx-1 rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Items Section (only shown when "All" category is selected) */}
      {activeCategory === 'All' && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3 text-foreground">Menu Populer</h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-2 min-w-max">
              {menuItems
                .filter(item => item.popular)
                .map(item => (
                  <PopularMenuCard
                    key={`popular-${item.id}`}
                    item={item}
                    formatPrice={formatPrice}
                    onClick={() => openItemDetails(item.id)}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="flex-1 p-4">
        <h2 className="text-lg font-semibold mb-3 text-foreground">
          {activeCategory === 'All' ? 'Semua Menu' : activeCategory}
        </h2>
        
        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada menu yang sesuai dengan pencarian
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredMenuItems.map((item) => (
              <ModalDetail
                key={`modal-${item.id}`}
                closeItemDetails={closeItemDetails}
                item={item}
                itemQuantity={itemQuantity}
                setItemQuantity={setItemQuantity}
                addToCart={() => addToCart(item)}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-card border-t p-2 sticky bottom-0 z-10">
        <div className="flex justify-around">
          <button className="flex flex-col items-center px-3 py-1 text-primary">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center px-3 py-1 text-muted-foreground">
            <MenuIcon className="w-6 h-6" />
            <span className="text-xs">Menu</span>
          </button>
          
          {/* Cart Button with Animation */}
          <div className="flex flex-col items-center px-3 py-1 text-muted-foreground relative">
            <Cart
              cartItems={cartItems}
              formatPrice={formatPrice}
              updateItemQuantity={updateItemQuantity}
              removeItem={removeItem}
              clearCart={clearCart}
            />
            
            {/* Animation overlay for cart badge */}
            {cartBadgeAnimation && (
              <div className="absolute -top-1 -right-1 w-8 h-8 flex items-center justify-center">
                <div className="absolute w-5 h-5 bg-primary rounded-full animate-cart-badge-pulse"></div>
              </div>
            )}
          </div>
          
          <button className="flex flex-col items-center px-3 py-1 text-muted-foreground">
            <User className="w-6 h-6" />
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}