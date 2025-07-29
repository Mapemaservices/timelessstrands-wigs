import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Phone, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  user: any;
  cartItems: any[];
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, cartItems, onAuthClick }) => {
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          if (!error) {
            setIsAdmin(data || false);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been signed out.",
      });
    }
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-elegant sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gold text-ts-black py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4 overflow-hidden">
            <span className="hidden sm:block">🇰🇪 Free Delivery in Nairobi County | Express Delivery Available</span>
            <span className="sm:hidden">🇰🇪 Free Delivery Available</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">+254 768 174 878</span>
              <span className="sm:hidden">Call</span>
            </div>
            <span className="hidden sm:inline">|</span>
            <span className="hidden md:inline">Customer Service 24/7</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gold w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-ts-black font-bold text-xl">TS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-poppins">Timeless Strands</h1>
              <p className="text-xs opacity-90">Premium Wigs Kenya</p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for wigs, colors, sizes..."
                className="w-full pl-4 pr-12 py-2 rounded-full border-2 border-gold focus:border-gold-light text-ts-black"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gold hover:bg-gold-dark rounded-full p-1.5 transition-colors">
                <Search className="w-4 h-4 text-ts-black" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('products')}
              className="hover:text-gold transition-colors"
            >
              Wigs
            </button>
            <button 
              onClick={() => scrollToSection('checkout')}
              className="hover:text-gold transition-colors"
            >
              Checkout
            </button>
            <button 
              onClick={() => scrollToSection('track-order')}
              className="hover:text-gold transition-colors"
            >
              Track Order
            </button>
            <button 
              onClick={() => scrollToSection('checkout')}
              className="bg-gold hover:bg-gold-dark text-ts-black px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-105 flex items-center space-x-1"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden lg:inline">Cart ({cartItems.length})</span>
              <span className="lg:hidden">({cartItems.length})</span>
            </button>
            
            {/* Admin Button */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full font-semibold transition-all transform hover:scale-105"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}
            
            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm hidden lg:block">Hi, {user.user_metadata?.display_name || user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gold hover:text-gold-dark transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-1 bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-ts-black px-4 py-2 rounded-full font-semibold transition-all"
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">Sign In</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={() => scrollToSection('checkout')}
              className="bg-gold hover:bg-gold-dark text-ts-black p-2 rounded-full font-semibold transition-all relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gold hover:text-gold-dark transition-colors p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for wigs..."
              className="w-full pl-4 pr-12 py-2 rounded-full border-2 border-gold focus:border-gold-light text-ts-black"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gold hover:bg-gold-dark rounded-full p-1.5 transition-colors">
              <Search className="w-4 h-4 text-ts-black" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-elegant border border-gold/20 p-4">
            <nav className="space-y-3">
              <button 
                onClick={() => {
                  scrollToSection('products');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-4 hover:bg-gold hover:text-ts-black rounded-lg transition-colors"
              >
                Wigs
              </button>
              <button 
                onClick={() => {
                  scrollToSection('checkout');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-4 hover:bg-gold hover:text-ts-black rounded-lg transition-colors"
              >
                Checkout
              </button>
              <button 
                onClick={() => {
                  scrollToSection('track-order');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-4 hover:bg-gold hover:text-ts-black rounded-lg transition-colors"
              >
                Track Order
              </button>
              
              {/* Mobile Auth */}
              {user ? (
                <div className="border-t pt-3 space-y-3">
                  <div className="text-sm text-muted-foreground px-4">
                    Hi, {user.user_metadata?.display_name || user.email}
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="border-t pt-3">
                  <button
                    onClick={() => {
                      onAuthClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left py-2 px-4 bg-gold text-ts-black rounded-lg font-semibold transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;