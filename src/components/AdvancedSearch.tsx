import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchFilters {
  priceRange: [number, number];
  categories: string[];
  colors: string[];
  lengths: string[];
  laceTypes: string[];
  density: string[];
  rating: number;
  inStock: boolean;
  freeShipping: boolean;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onClose?: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 30000],
    categories: [],
    colors: [],
    lengths: [],
    laceTypes: [],
    density: [],
    rating: 0,
    inStock: false,
    freeShipping: false
  });

  const categories = ['Closure', 'Frontal', 'Glueless', 'BOB', 'Pixie'];
  const colors = ['Natural Black (1B)', 'Burgundy (99J)', 'Blonde (27)', 'Brown (4)', 'Red', 'Mixed Colors'];
  const lengths = ['10 inches', '12 inches', '14 inches', '16 inches', '18 inches', '20 inches', '22 inches', '24 inches', '26 inches', '28 inches', '30 inches'];
  const laceTypes = ['4x4 Closure', '5x5 Closure', '13x4 Frontal', 'Glueless', 'No Lace'];
  const densityOptions = ['150%', '180%', '210%', '250%'];

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleArrayFilterToggle = (filterType: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: (prev[filterType] as string[]).includes(value)
        ? (prev[filterType] as string[]).filter(item => item !== value)
        : [...(prev[filterType] as string[]), value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 30000],
      categories: [],
      colors: [],
      lengths: [],
      laceTypes: [],
      density: [],
      rating: 0,
      inStock: false,
      freeShipping: false
    });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.categories.length +
      filters.colors.length +
      filters.lengths.length +
      filters.laceTypes.length +
      filters.density.length +
      (filters.rating > 0 ? 1 : 0) +
      (filters.inStock ? 1 : 0) +
      (filters.freeShipping ? 1 : 0) +
      (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 30000 ? 1 : 0)
    );
  };

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-card-foreground">Advanced Search</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-card-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for wigs, styles, colors..."
          className="w-full pl-4 pr-12 py-3 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
        <button 
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gold hover:bg-gold-dark text-ts-black rounded-lg p-2 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gold hover:text-gold-dark transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="bg-gold text-ts-black">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </button>
        
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="space-y-6 border-t pt-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Price Range
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                className="w-24 px-3 py-2 border border-border rounded-lg text-sm"
                placeholder="Min"
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 30000])}
                className="w-24 px-3 py-2 border border-border rounded-lg text-sm"
                placeholder="Max"
              />
              <span className="text-sm text-muted-foreground">Ksh</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleArrayFilterToggle('categories', category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.categories.includes(category)
                      ? 'bg-gold text-ts-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Colors
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => handleArrayFilterToggle('colors', color)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.colors.includes(color)
                      ? 'bg-gold text-ts-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Lace Types */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Lace Types
            </label>
            <div className="flex flex-wrap gap-2">
              {laceTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleArrayFilterToggle('laceTypes', type)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.laceTypes.includes(type)
                      ? 'bg-gold text-ts-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Quick Filters
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm">In Stock Only</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.freeShipping}
                  onChange={(e) => handleFilterChange('freeShipping', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm">Free Shipping</span>
              </label>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Minimum Rating
            </label>
            <div className="flex space-x-2">
              {[4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange('rating', rating)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1 ${
                    filters.rating === rating
                      ? 'bg-gold text-ts-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{rating}</span>
                  <span>★</span>
                  <span>& up</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Button */}
      <Button 
        onClick={handleSearch}
        className="w-full bg-gold hover:bg-gold-dark text-ts-black font-semibold"
      >
        Search Products
      </Button>
    </div>
  );
};

export default AdvancedSearch;