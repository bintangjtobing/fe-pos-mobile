'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

// Helper untuk memformat harga dengan cara yang sama di server dan client
const formatPrice = (price: number) => {
  return price.toString();
};

export default function Menu() {
  // Sample menu data - in a real app this would come from an API
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Nasi Goreng Spesial',
      category: 'Main Course',
      price: 35000,
      description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
      image: '/placeholder.jpg',
      popular: true,
    },
    {
      id: 2,
      name: 'Mie Goreng',
      category: 'Main Course',
      price: 30000,
      description: 'Mie goreng dengan bumbu khas dan sayuran',
      image: '/placeholder.jpg',
      popular: false,
    },
    {
      id: 3,
      name: 'Sate Ayam',
      category: 'Appetizer',
      price: 25000,
      description: 'Sate ayam dengan bumbu kacang',
      image: '/placeholder.jpg',
      popular: true,
    },
    {
      id: 4,
      name: 'Es Teh Manis',
      category: 'Beverages',
      price: 8000,
      description: 'Teh manis dingin segar',
      image: '/placeholder.jpg',
      popular: false,
    },
    {
      id: 5,
      name: 'Jus Alpukat',
      category: 'Beverages',
      price: 15000,
      description: 'Jus alpukat segar dengan susu',
      image: '/placeholder.jpg',
      popular: true,
    },
    {
      id: 6,
      name: 'Ayam Goreng',
      category: 'Main Course',
      price: 28000,
      description: 'Ayam goreng renyah dengan sambal',
      image: '/placeholder.jpg',
      popular: false,
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
                  <div 
                    key={`popular-${item.id}`} 
                    className="flex-shrink-0 w-40 bg-card rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="w-full h-24 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Image</span>
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium text-sm text-card-foreground">{item.name}</h3>
                      <p className="text-primary text-sm font-bold">Rp {formatPrice(item.price)}</p>
                    </div>
                  </div>
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
              <div key={item.id} className="bg-card rounded-lg shadow-md overflow-hidden flex">
                <div className="w-24 h-24 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Image</span>
                </div>
                <div className="p-3 flex-1">
                  <h3 className="font-medium text-card-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  <p className="text-primary font-bold mt-1">Rp {formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-card border-t p-2 sticky bottom-0 z-10">
        <div className="flex justify-around">
          <button className="flex flex-col items-center px-3 py-1 text-primary">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center px-3 py-1 text-muted-foreground">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Menu</span>
          </button>
          <button className="flex flex-col items-center px-3 py-1 text-muted-foreground">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
            </svg>
            <span className="text-xs">Keranjang</span>
          </button>
          <button className="flex flex-col items-center px-3 py-1 text-muted-foreground">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}