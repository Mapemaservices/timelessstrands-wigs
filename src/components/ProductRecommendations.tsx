import React from 'react';
import { Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecommendedProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  originalPrice?: number;
}

interface ProductRecommendationsProps {
  currentProductId: number;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ currentProductId }) => {
  const navigate = useNavigate();

  // Mock recommended products
  const recommendations: RecommendedProduct[] = [
    {
      id: 2,
      name: "4x4 Lace Closure BOB Wig",
      image: "/placeholder.svg",
      price: 7200,
      rating: 4.8,
      reviews: 189,
      originalPrice: 8500
    },
    {
      id: 3,
      name: "5x5 Lace Closure Wig",
      image: "/placeholder.svg",
      price: 8405,
      rating: 4.7,
      reviews: 156
    },
    {
      id: 5,
      name: "Straight BOB Wig",
      image: "/placeholder.svg",
      price: 5210,
      rating: 4.8,
      reviews: 203
    },
    {
      id: 7,
      name: "Full Lace Frontal Wig",
      image: "/placeholder.svg",
      price: 10271,
      rating: 4.9,
      reviews: 145
    }
  ].filter(product => product.id !== currentProductId);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-card-foreground">You May Also Like</h3>
        <button 
          onClick={() => navigate('/')}
          className="text-gold hover:text-gold-dark transition-colors text-sm font-semibold"
        >
          View All
        </button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.slice(0, 4).map((product) => (
          <div 
            key={product.id}
            className="bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow border border-border group cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-t-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Discount Badge */}
              {product.originalPrice && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}

              {/* Quick View Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white text-ts-black px-3 py-2 rounded-lg font-semibold flex items-center space-x-2 transform scale-90 group-hover:scale-100 transition-transform">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Quick View</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-3 space-y-2">
              {/* Rating */}
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating) ? 'text-gold fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>

              {/* Product Name */}
              <h4 className="text-sm font-semibold text-card-foreground line-clamp-2 leading-tight">
                {product.name}
              </h4>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gold">
                    Ksh {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      Ksh {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="text-xs text-green-600">Free Shipping</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recently Viewed */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-card-foreground mb-4">Recently Viewed</h3>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {recommendations.slice(0, 3).map((product) => (
            <div 
              key={`recent-${product.id}`}
              className="flex-shrink-0 w-24 group cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg border group-hover:shadow-md transition-shadow"
              />
              <div className="mt-1">
                <div className="text-xs font-semibold text-card-foreground line-clamp-2 leading-tight">
                  {product.name}
                </div>
                <div className="text-xs text-gold font-bold">
                  Ksh {product.price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendations;