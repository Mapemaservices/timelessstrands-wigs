import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, Star } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-ts-black text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gold w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-ts-black font-bold text-xl">TS</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-poppins">Timeless Strands</h3>
                <p className="text-xs text-gray-400">Premium Wigs Kenya</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted source for premium human hair wigs in Kenya. We bring you the finest 
              quality wigs from Brazil, Peru, Vietnam, and India with nationwide delivery.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/TimelessStrands" className="bg-gold w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold-dark transition-colors">
                <Facebook className="w-5 h-5 text-ts-black" />
              </a>
              <a href="https://www.instagram.com/_timeless.strands" className="bg-gold w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold-dark transition-colors">
                <Instagram className="w-5 h-5 text-ts-black" />
              </a>
               <a 
                 href="https://www.tiktok.com/@Timeless_Strands"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="bg-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
               >
                 <span className="text-white text-lg font-bold">T</span>
               </a>
               <a 
                 href="https://wa.me/254768174878?text=Hi! I'm interested in your wigs." 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="bg-green-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
               >
                 <MessageCircle className="w-5 h-5 text-white" />
               </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gold">Quick Links</h4>
            <nav className="space-y-2">
              <button 
                onClick={() => scrollToSection('products')}
                className="block text-gray-300 hover:text-gold transition-colors text-sm"
              >
                Shop Wigs
              </button>
              <button 
                onClick={() => scrollToSection('checkout')}
                className="block text-gray-300 hover:text-gold transition-colors text-sm"
              >
                Checkout
              </button>
              <button 
                onClick={() => scrollToSection('track-order')}
                className="block text-gray-300 hover:text-gold transition-colors text-sm"
              >
                Track Order
              </button>
              <a href="#" className="block text-gray-300 hover:text-gold transition-colors text-sm">
                Wig Care Guide
              </a>
              <a href="#" className="block text-gray-300 hover:text-gold transition-colors text-sm">
                Size Guide
              </a>
              <a href="#" className="block text-gray-300 hover:text-gold transition-colors text-sm">
                Return Policy
              </a>
            </nav>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gold">Categories</h4>
            <nav className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-gold transition-colors text-sm">
                Lace Front Wigs
              </a>
              <a href="#" className="block text-gray-300 hover:text-gold transition-colors text-sm">
                Full Lace Wigs
              </a>
              <a href="#" className="block text-gray-300 hover:text-gold transition-colors text-sm">
                360 Lace Wigs
              </a>
              <a href="#" className="block text-gray-300 hover:text-gold transition-colors text-sm">
                Closure Wigs
              </a>
              <a href="#" className="block text-gray-300 hover:text-gold transition-colors text-sm">
                Brazilian Hair
              </a>
              <a href="#" className="block text-gray-300 hover:text-gold transition-colors text-sm">
                Peruvian Hair
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gold">Contact Us</h4>
            <div className="space-y-3">
              {/* ADMIN: Update contact information here */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <p className="text-gray-300 text-sm font-semibold">Store Location</p>
                  <p className="text-gray-400 text-sm">
                    StarMall C1<br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <p className="text-gray-300 text-sm font-semibold">Phone & WhatsApp</p>
                   <a 
                     href="tel:+254768174878" 
                     className="text-gray-400 text-sm hover:text-gold transition-colors"
                   >
                     +254 768 174 878
                   </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <p className="text-gray-300 text-sm font-semibold">Email</p>
                   <a 
                     href="mailto:timelessstrands@outlook.com" 
                     className="text-gray-400 text-sm hover:text-gold transition-colors"
                   >
                     timelessstrands@outlook.com
                   </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <p className="text-gray-300 text-sm font-semibold">Business Hours</p>
                  <p className="text-gray-400 text-sm">
                    Mon - Sat: 9AM - 7PM<br />
                    Sunday: 10AM - 5PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gold">1000+</div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">5.0★</div>
              <div className="text-sm text-gray-400">Customer Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">5-14</div>
              <div className="text-sm text-gray-400">Days Delivery</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">100%</div>
              <div className="text-sm text-gray-400">Human Hair</div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center">
            <h4 className="text-lg font-bold text-gold mb-4">We Accept</h4>
            <div className="flex justify-center items-center space-x-6">
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">
                M-PESA
              </div>
              <div className="text-gray-400 text-sm">
                Secure payments powered by Safaricom M-Pesa
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-ts-black/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Timeless Strands. All rights reserved. | WigPreOrder KE | Powered by Mapema Softwares
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">Shipping Policy</a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">Return Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;