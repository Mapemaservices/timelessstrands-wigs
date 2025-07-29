import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import ProductListing from '@/components/ProductListing';
import CheckoutForm from '@/components/CheckoutForm';
import OrderConfirmation from '@/components/OrderConfirmation';
import TrackOrder from '@/components/TrackOrder';
import Footer from '@/components/Footer';
import AuthPage from '@/components/AuthPage';
import LiveChat from '@/components/LiveChat';
import FloatingIcons from '@/components/FloatingIcons';
import { WishlistProvider } from '@/components/WishlistProvider';
import { Toaster } from '@/components/ui/toaster';

interface CartItem {
  id: number;
  name: string;
  image: string;
  laceSize: string;
  inchSize: string;
  price: number;
  quantity: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderData, setOrderData] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setShowAuth(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdateCart = (items: CartItem[]) => {
    setCartItems(items);
  };

  const handleOrderSubmit = (data: any) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    setOrderData(data);
    // In a real app, this would be sent to a backend
    console.log('Order submitted:', data);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  const handleAuthClick = () => {
    setShowAuth(true);
  };

  if (showAuth) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <WishlistProvider>
      <div className="min-h-screen bg-background">
        {/* ADMIN SECTION: All website sections - edit content directly in each component */}
        
        {/* 1. Header: Logo and navigation */}
        <Header user={user} cartItems={cartItems} onAuthClick={handleAuthClick} />
        
        {/* 2. Hero Banner: Big bold call-to-action */}
        <HeroBanner />
        
        {/* 3. Product Listing: Grid layout with product cards */}
        <ProductListing onUpdateCart={handleUpdateCart} />
        
        {/* 4. Checkout Form: Customer details and payment */}
        <CheckoutForm cartItems={cartItems} onOrderSubmit={handleOrderSubmit} />
        
        {/* 5. Confirmation Section: Order confirmation */}
        <OrderConfirmation orderData={orderData} />
        
        {/* 6. Track Order Section: Order tracking */}
        <TrackOrder />
        
        {/* 7. Footer: Contact info and links */}
        <Footer />
        
        {/* Live Chat */}
        <LiveChat />
        
        {/* Floating Icons */}
        <FloatingIcons />
        
        {/* Toast Notifications */}
        <Toaster />
      </div>
    </WishlistProvider>
  );
};

export default Index;
