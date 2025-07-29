import React from 'react';
import { X, Star, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  laceSize: string;
  density: string;
  length: string;
  color: string;
  features: string[];
  inStock: boolean;
}

interface ProductComparisonProps {
  products: Product[];
  onRemoveProduct: (id: number) => void;
  onAddToCart: (product: Product) => void;
  onClose: () => void;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onRemoveProduct,
  onAddToCart,
  onClose
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No products to compare</p>
      </div>
    );
  }

  const maxFeatures = Math.max(...products.map(p => p.features.length));
  const allFeatures = Array.from(new Set(products.flatMap(p => p.features)));

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Product Comparison</h3>
        <button
          onClick={onClose}
          className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <td className="p-4 font-semibold text-card-foreground">Products</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center min-w-[280px]">
                  <div className="relative">
                    <button
                      onClick={() => onRemoveProduct(product.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-3"
                    />
                    
                    <h4 className="font-semibold text-card-foreground text-sm mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    
                    {!product.inStock && (
                      <Badge variant="destructive" className="mb-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Price Row */}
            <tr className="border-b border-border bg-gray-50/50">
              <td className="p-4 font-medium text-card-foreground">Price</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-gold">
                      Ksh {product.price.toLocaleString()}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        Ksh {product.originalPrice.toLocaleString()}
                      </div>
                    )}
                    {product.originalPrice && (
                      <div className="text-xs text-green-600 font-semibold">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-card-foreground">Rating</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-gold fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </div>
                </td>
              ))}
            </tr>

            {/* Lace Size Row */}
            <tr className="border-b border-border bg-gray-50/50">
              <td className="p-4 font-medium text-card-foreground">Lace Size</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Badge variant="outline">{product.laceSize}</Badge>
                </td>
              ))}
            </tr>

            {/* Density Row */}
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-card-foreground">Density</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Badge variant="outline">{product.density}</Badge>
                </td>
              ))}
            </tr>

            {/* Length Row */}
            <tr className="border-b border-border bg-gray-50/50">
              <td className="p-4 font-medium text-card-foreground">Length</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Badge variant="outline">{product.length}</Badge>
                </td>
              ))}
            </tr>

            {/* Color Row */}
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-card-foreground">Color</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Badge variant="outline">{product.color}</Badge>
                </td>
              ))}
            </tr>

            {/* Features Rows */}
            {allFeatures.map((feature, index) => (
              <tr key={feature} className={`border-b border-border ${index % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                <td className="p-4 font-medium text-card-foreground">{feature}</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    {product.features.includes(feature) ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          {/* Action Row */}
          <tfoot>
            <tr>
              <td className="p-4 font-medium text-card-foreground">Actions</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="space-y-2">
                    <Button
                      onClick={() => onAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full bg-gold hover:bg-gold-dark text-ts-black"
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => window.open(`/product/${product.id}`, '_blank')}
                    >
                      View Details
                    </Button>
                  </div>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Comparison Tips */}
      <div className="bg-blue-50 border-t border-border p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Comparison Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Consider your budget and preferred features</li>
              <li>• Check customer reviews for real experiences</li>
              <li>• Higher density typically means fuller-looking hair</li>
              <li>• Lace size affects the natural hairline appearance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;