import React from 'react';
import { Star, ShoppingBag, Truck } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroBanner = () => {
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-r from-ts-black via-ts-black to-gold overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBanner})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-ts-black/90 via-ts-black/70 to-gold/20" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold px-4 py-2 rounded-full">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">#1 Premium Wigs in Kenya</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-white font-poppins leading-tight">
                Discover Your
                <span className="text-gold"> Perfect</span>
                <br />
                Wig Collection
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Premium human hair wigs from Brazil, Peru, Vietnam & India. Transform your look with 
                our curated collection of luxury lace fronts, full lace, and closure wigs.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
              <div className="flex items-center space-x-3 text-white">
                <div className="bg-gold w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-ts-black text-xl">🎯</span>
                </div>
                <span className="font-semibold">100% Human Hair</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="bg-gold w-10 h-10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-ts-black" />
                </div>
                <span className="font-semibold">5-14 Days Delivery</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="bg-gold w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-ts-black text-xl">💎</span>
                </div>
                <span className="font-semibold">Premium Quality</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToProducts}
                className="bg-gold hover:bg-gold-dark text-ts-black px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-gold"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Shop Now</span>
              </button>
              <button className="border-2 border-gold text-gold hover:bg-gold hover:text-ts-black px-8 py-4 rounded-full font-bold text-lg transition-all">
                View Collection
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">1000+</div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">5.0</div>
                <div className="text-sm text-gray-300 flex items-center">
                  <Star className="w-4 h-4 text-gold fill-current mr-1" />
                  Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">2+</div>
                <div className="text-sm text-gray-300">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right Column - Featured Product Preview */}
          <div className="lg:flex justify-center hidden">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-elegant">
              <div className="text-center space-y-4">
                <div className="bg-gold w-24 h-24 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-4xl">👑</span>
                </div>
                <h3 className="text-xl font-bold text-white">Premium Quality</h3>
                <p className="text-gray-300">
                  Sourced directly from Brazil, Peru, Vietnam & India for the finest hair quality
                </p>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;