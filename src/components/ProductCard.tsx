import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Heart, ChevronLeft, ChevronRight, Share2, Play, Video, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from './WishlistProvider';
import { toast } from 'sonner';

interface ProductVariant {
  laceSize: string;
  inchSize: string;
  price: number;
  stock: number;
  density?: string;
  color?: string;
  style?: string;
}

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviews: number;
  originalPrice?: number;
  hasVideo?: boolean;
  videoLength?: string;
  category?: string;
  onAddToCart: (product: any) => void;
  onAddToCompare?: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  images,
  variants,
  rating,
  reviews,
  originalPrice,
  hasVideo = false,
  videoLength,
  category,
  onAddToCart,
  onAddToCompare
}) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Find first available lace size and inch size from variants
  const firstVariant: ProductVariant | undefined = variants[0];
  const [selectedLaceSize, setSelectedLaceSize] = useState(firstVariant?.laceSize || '');
  const [selectedInchSize, setSelectedInchSize] = useState(firstVariant?.inchSize || '');
  
  const isWishlisted = isInWishlist(id);

  const uniqueLaceSizes = [...new Set(variants.map(v => v.laceSize))];
  const availableInchSizes = variants
    .filter(v => !selectedLaceSize || v.laceSize === selectedLaceSize)
    .map(v => v.inchSize);

  const selectedVariant = variants.find(
    v => v.laceSize === selectedLaceSize && v.inchSize === selectedInchSize
  );

  // Show only the price of the first or selected variant
  const currentPrice = selectedVariant?.price ?? firstVariant?.price ?? 0;
  const currentStock = (selectedLaceSize && selectedInchSize && selectedVariant)
    ? selectedVariant.stock
    : (firstVariant?.stock || 0);

  const canAddToCart =
    (variants.length === 1 && firstVariant?.stock > 0) ||
    (selectedLaceSize && selectedInchSize && currentStock > 0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id,
        name,
        price: currentPrice,
        image: images[0]
      });
      toast.success('Added to wishlist');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: description,
          url: `${window.location.origin}/product/${id}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/product/${id}`);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    let cartItem;
    if (variants.length === 1 && firstVariant) {
      cartItem = {
        id,
        name,
        image: images[0],
        price: firstVariant.price,
        laceSize: firstVariant.laceSize,
        inchSize: firstVariant.inchSize,
        quantity: 1
      };
    } else {
      cartItem = {
        id,
        name,
        image: images[0],
        price: currentPrice,
        laceSize: selectedLaceSize,
        inchSize: selectedInchSize,
        quantity: 1
      };
    }
    onAddToCart(cartItem);
    toast.success(`Added ${name} to cart!`);
  };

  const handleAddToCompare = () => {
    if (onAddToCompare) {
      onAddToCompare({
        id,
        name,
        images,
        variants,
        rating,
        reviews,
        hasVideo,
        videoLength
      });
      toast.success('Added to comparison list!');
    }
  };

  return (
    <div className="group bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-border w-full max-w-sm mx-auto">
      {/* Image Section */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Main Image */}
        <img
          src={images[currentImageIndex] || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Video Badge */}
        {hasVideo && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/80 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-semibold">
            <Video className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{videoLength}</span>
          </div>
        )}

        {/* Image Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full transition-colors shadow-md opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full transition-colors shadow-md opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistToggle}
            className={`p-1.5 rounded-full transition-colors shadow-md ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white text-gray-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="bg-white/90 hover:bg-white p-1.5 rounded-full transition-colors shadow-md"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
          {onAddToCompare && (
            <button
              onClick={handleAddToCompare}
              className="bg-white/90 hover:bg-white p-1.5 rounded-full transition-colors shadow-md"
            >
              <Scale className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Status Badges */}
        <div className={`absolute ${hasVideo ? 'top-12' : 'top-4'} left-2 flex flex-col space-y-1`}>
          {currentStock === 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </div>
          )}
          {originalPrice && currentPrice < originalPrice && (
            <div className="bg-gold text-ts-black px-2 py-1 rounded-full text-xs font-semibold">
              -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
            </div>
          )}
          {currentStock > 0 && currentStock <= 3 && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Only {currentStock} left
            </div>
          )}
        </div>

        {/* Quick View on Hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(`/product/${id}`)}
              className="bg-white text-ts-black px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 transform scale-90 group-hover:scale-100 transition-transform text-sm"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View Details</span>
            </button>
            {hasVideo && (
              <button 
                onClick={() => navigate(`/product/${id}`)}
                className="bg-gold text-ts-black px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 transform scale-90 group-hover:scale-100 transition-transform text-sm"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Watch Video</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Product Info */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-card-foreground group-hover:text-gold transition-colors line-clamp-2 font-poppins mb-1">
            {name}
          </h3>
          {category && (
            <div className="text-xs font-semibold text-gold mb-1">Category: {category}</div>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {rating} ({reviews} reviews)
          </span>
        </div>

        {/* Size & Variant Selection */}
        <div className="space-y-2">
          {/* Lace Size */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-1">Lace Size:</label>
            <select
              value={selectedLaceSize}
              onChange={(e) => setSelectedLaceSize(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold/20"
            >
              <option value="">Select Lace Size</option>
              {uniqueLaceSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Inch Size */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-1">Length:</label>
            <select
              value={selectedInchSize}
              onChange={(e) => setSelectedInchSize(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold/20"
            >
              <option value="">Select Length</option>
              {availableInchSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Density */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-1">Density:</label>
            <select
              value={selectedVariant?.density || ''}
              onChange={(e) => {
                // Find variant with selected density
                const density = e.target.value;
                const match = variants.find(v => v.density === density && v.laceSize === selectedLaceSize && v.inchSize === selectedInchSize);
                if (match) {
                  setSelectedLaceSize(match.laceSize);
                  setSelectedInchSize(match.inchSize);
                }
              }}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold/20"
            >
              <option value="">Select Density</option>
              {[...new Set(variants.map(v => v.density).filter(Boolean))].map(density => (
                <option key={density} value={density}>{density}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-1">Color:</label>
            <select
              value={selectedVariant?.color || ''}
              onChange={(e) => {
                // Find variant with selected color
                const color = e.target.value;
                const match = variants.find(v => v.color === color && v.laceSize === selectedLaceSize && v.inchSize === selectedInchSize);
                if (match) {
                  setSelectedLaceSize(match.laceSize);
                  setSelectedInchSize(match.inchSize);
                }
              }}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold/20"
            >
              <option value="">Select Color</option>
              {[...new Set(variants.map(v => v.color).filter(Boolean))].map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-1">Style:</label>
            <select
              value={selectedVariant?.style || ''}
              onChange={(e) => {
                // Find variant with selected style
                const style = e.target.value;
                const match = variants.find(v => v.style === style && v.laceSize === selectedLaceSize && v.inchSize === selectedInchSize);
                if (match) {
                  setSelectedLaceSize(match.laceSize);
                  setSelectedInchSize(match.inchSize);
                }
              }}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold/20"
            >
              <option value="">Select Style</option>
              {[...new Set(variants.map(v => v.style).filter(Boolean))].map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Show extra variant details if selected */}
        {selectedVariant && (
          <div className="space-y-1 pt-2">
            {selectedVariant.density && (
              <div className="text-sm text-card-foreground"><strong>Density:</strong> {selectedVariant.density}</div>
            )}
            {selectedVariant.color && (
              <div className="text-sm text-card-foreground"><strong>Color:</strong> {selectedVariant.color}</div>
            )}
            {selectedVariant.style && (
              <div className="text-sm text-card-foreground"><strong>Style:</strong> {selectedVariant.style}</div>
            )}
            {selectedVariant.inchSize && (
              <div className="text-sm text-card-foreground"><strong>Inch Size:</strong> {selectedVariant.inchSize}</div>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gold">
              Ksh {currentPrice.toLocaleString()}
            </span>
            {originalPrice && currentPrice < originalPrice && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                Ksh {originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all text-sm transform hover:scale-105 flex items-center justify-center space-x-1 ${
              canAddToCart
                ? 'bg-gold hover:bg-gold-dark text-ts-black'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden xs:inline">Add to Cart</span>
            <span className="xs:hidden">Add</span>
          </button>
          
          <button
            onClick={() => navigate(`/product/${id}`)}
            className="px-3 py-2 border border-border rounded-lg font-semibold hover:bg-muted transition-all text-sm transform hover:scale-105 flex items-center justify-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden xs:inline">View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;