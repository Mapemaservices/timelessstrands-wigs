import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share2, Play, ShoppingCart, Plus, Minus, Check, Truck, Shield, RotateCcw, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductReviews from '@/components/ProductReviews';
// ...existing code...
import { useWishlist } from '@/components/WishlistProvider';
import { products, Product } from '@/data/products';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details');
  
  const isWishlisted = isInWishlist(parseInt(id || '0'));

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user || null;
    },
  });

  // Products are now imported from shared data file

  const product = products.find(p => p.id === parseInt(id || ''));

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const currentVariant = product.variants[selectedVariant];

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.images[0],
      laceSize: currentVariant.laceSize,
      inchSize: currentVariant.inchSize,
      price: currentVariant.price,
      quantity: quantity
    };
    
    // Update local cart state
    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.id === cartItem.id && 
        item.laceSize === cartItem.laceSize && 
        item.inchSize === cartItem.inchSize
      );
      
      if (existingItem) {
        return prev.map(item => 
          item.id === cartItem.id && 
          item.laceSize === cartItem.laceSize && 
          item.inchSize === cartItem.inchSize
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        );
      } else {
        return [...prev, cartItem];
      }
    });
    
    toast.success(`Added ${product.name} to cart!`);
    
    // Redirect to checkout section
    setTimeout(() => {
      navigate('/', { state: { scrollToCheckout: true } });
    }, 1000);
  };

  const handleWishlistToggle = () => {
    const productId = parseInt(id || '0');
    if (isWishlisted) {
      removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: productId,
        name: product.name,
        image: product.images[0],
        price: currentVariant.price
      });
      toast.success('Added to wishlist');
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= currentVariant.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        cartItems={cartItems} 
        onAuthClick={() => setShowAuth(true)} 
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images & Video */}
          <div className="space-y-4">
            {/* Main Image/Video Display */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {showVideo && product.hasVideo && product.video ? (
                <video
                  controls
                  className="w-full h-full object-cover"
                  poster={product.images[selectedImageIndex]}
                >
                  <source src={product.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Video Play Button Overlay */}
              {product.hasVideo && !showVideo && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 bg-black/20 flex items-center justify-center group hover:bg-black/30 transition-colors"
                >
                  <div className="bg-white rounded-full p-4 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary fill-current" />
                  </div>
                </button>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button
                  onClick={handleWishlistToggle}
                  className="bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
                <button
                  onClick={() => setShowImageZoom(true)}
                  className="bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                >
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Image Thumbnails */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    setShowVideo(false);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index && !showVideo ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              
              {/* Video Thumbnail */}
              {product.hasVideo && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors relative ${
                    showVideo ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img src={product.images[0]} alt="Video thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {product.category}
                </Badge>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-primary">
              Ksh {currentVariant.price.toLocaleString()}
            </div>

            {/* Variant Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size & Length Options:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedVariant(index);
                        setQuantity(1);
                      }}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedVariant === index
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{variant.laceSize} - {variant.inchSize}</div>
                          <div className="text-sm text-gray-500">Ksh {variant.price.toLocaleString()}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= currentVariant.stock}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={currentVariant.stock === 0}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Free Shipping</div>
                  <div className="text-xs text-gray-500">On orders over Ksh 5,000</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Quality Guarantee</div>
                  <div className="text-xs text-gray-500">100% human hair</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Easy Returns</div>
                  <div className="text-xs text-gray-500">30-day return policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {(['details', 'reviews', 'shipping'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'details' ? 'Product Details' : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'details' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                <ul className="space-y-2">
                  <li><strong>Hair Type:</strong> 100% Virgin Human Hair</li>
                  <li><strong>Texture:</strong> Natural</li>
                  <li><strong>Color:</strong> Can be dyed</li>
                  <li><strong>Care:</strong> Wash with sulfate-free shampoo</li>
                  <li><strong>Lifespan:</strong> 12-18 months with proper care</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <ProductReviews 
                productId={parseInt(id || '0')} 
                rating={product.rating} 
                totalReviews={product.reviews} 
              />
            )}
            
            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping & Returns</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Delivery Options</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Standard Delivery: 2-3 business days</li>
                      <li>• Express Delivery: Next day delivery</li>
                      <li>• Free shipping on orders over Ksh 5,000</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Return Policy</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• 30-day return window</li>
                      <li>• Free returns for defective items</li>
                      <li>• Original packaging required</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Only product details are shown. Coupons and recommendations removed. */}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;