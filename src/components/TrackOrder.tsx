import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, Phone, Mail } from 'lucide-react';

const TrackOrder = () => {
  const [searchType, setSearchType] = useState<'order' | 'phone'>('order');
  const [searchValue, setSearchValue] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ADMIN SECTION: Manually update order statuses here
  const sampleOrders: { [key: string]: any } = {
    'TS1705123456': {
      orderNumber: 'TS1705123456',
      customerName: 'Jane Doe',
      status: 'shipped',
      statusText: 'Your wig is now in Kenya. Awaiting delivery in 2 days.',
      progress: 75,
      timeline: [
        { status: 'confirmed', text: 'Order Confirmed', date: '2024-01-15', completed: true },
        { status: 'processing', text: 'Processing & Packing', date: '2024-01-16', completed: true },
        { status: 'shipped', text: 'Shipped to Kenya', date: '2024-01-20', completed: true },
        { status: 'delivered', text: 'Delivered', date: 'Expected: 2024-01-25', completed: false }
      ],
      estimatedDelivery: '2024-01-25',
      trackingNumber: 'KE1234567890',
      items: [
        { name: 'Brazilian Ombre Lace Front Wig', size: '13x4 • 18 inches', quantity: 1 }
      ]
    },
    'TS1705234567': {
      orderNumber: 'TS1705234567',
      customerName: 'Mary Smith',
      status: 'processing',
      statusText: 'Your order is being processed and will ship within 3-5 days.',
      progress: 25,
      timeline: [
        { status: 'confirmed', text: 'Order Confirmed', date: '2024-01-22', completed: true },
        { status: 'processing', text: 'Processing & Packing', date: 'In Progress', completed: false },
        { status: 'shipped', text: 'Shipped to Kenya', date: 'Pending', completed: false },
        { status: 'delivered', text: 'Delivered', date: 'Pending', completed: false }
      ],
      estimatedDelivery: '2024-02-05',
      trackingNumber: null,
      items: [
        { name: 'Peruvian Straight Full Lace Wig', size: 'Full Lace • 16 inches', quantity: 1 }
      ]
    }
    // Admin: Add more sample orders as needed
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      let result = null;
      
      if (searchType === 'order') {
        result = sampleOrders[searchValue.toUpperCase()];
      } else {
        // Search by phone number
        const phoneOrders = Object.values(sampleOrders).filter((order: any) => 
          order.customerName.toLowerCase().includes(searchValue.toLowerCase()) // Simplified search
        );
        result = phoneOrders[0] || null;
      }

      setTrackingResult(result);
      setIsLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'processing':
        return <Package className="w-6 h-6 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-orange-600" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <section id="track-order" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground font-poppins mb-4">
            Track Your Order
          </h2>
          <p className="text-lg text-muted-foreground">
            Enter your order number or phone number to check your delivery status
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Search Form */}
          <div className="bg-card rounded-xl shadow-elegant p-6 mb-8">
            <form onSubmit={handleTrackOrder} className="space-y-6">
              {/* Search Type Selection */}
              <div className="flex justify-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    value="order"
                    checked={searchType === 'order'}
                    onChange={(e) => setSearchType(e.target.value as 'order' | 'phone')}
                    className="text-gold focus:ring-gold mr-2"
                  />
                  <span>Order Number</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    value="phone"
                    checked={searchType === 'phone'}
                    onChange={(e) => setSearchType(e.target.value as 'order' | 'phone')}
                    className="text-gold focus:ring-gold mr-2"
                  />
                  <span>Phone Number</span>
                </label>
              </div>

              {/* Search Input */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={
                    searchType === 'order' 
                      ? 'Enter order number (e.g., TS1705123456)' 
                      : 'Enter phone number'
                  }
                  className="flex-1 p-4 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 text-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading || !searchValue.trim()}
                  className="bg-gold hover:bg-gold-dark disabled:bg-gray-medium disabled:cursor-not-allowed text-ts-black font-bold px-8 py-4 rounded-lg transition-all flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ts-black"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Track Order</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Sample Order Numbers for Testing */}
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Try sample order numbers: <strong>TS1705123456</strong> or <strong>TS1705234567</strong>
              </p>
            </div>
          </div>

          {/* Tracking Results */}
          {trackingResult && (
            <div className="bg-card rounded-xl shadow-elegant overflow-hidden">
              {/* Header */}
              <div className="bg-gold p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-ts-black">
                      Order #{trackingResult.orderNumber}
                    </h3>
                    <p className="text-ts-black opacity-80">
                      Customer: {trackingResult.customerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-ts-black font-semibold">
                      Status: {trackingResult.status.charAt(0).toUpperCase() + trackingResult.status.slice(1)}
                    </p>
                    {trackingResult.trackingNumber && (
                      <p className="text-ts-black opacity-80 font-mono text-sm">
                        Tracking: {trackingResult.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Content */}
              <div className="p-6 space-y-8">
                {/* Current Status */}
                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-green-800 mb-2">Current Status</h4>
                    <p className="text-green-700 text-lg">{trackingResult.statusText}</p>
                    {trackingResult.estimatedDelivery && (
                      <p className="text-sm text-green-600 mt-2">
                        <strong>Estimated Delivery:</strong> {new Date(trackingResult.estimatedDelivery).toLocaleDateString('en-KE')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Order Progress</span>
                    <span>{trackingResult.progress}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gold h-3 rounded-full transition-all duration-300"
                      style={{ width: `${trackingResult.progress}%` }}
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-lg font-bold mb-6">Order Timeline</h4>
                  <div className="space-y-6">
                    {trackingResult.timeline.map((step: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 ${step.completed ? 'opacity-100' : 'opacity-40'}`}>
                          {getStatusIcon(step.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className={`font-semibold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.text}
                              </h5>
                              <p className={`text-sm ${step.completed ? 'text-muted-foreground' : 'text-muted-foreground opacity-60'}`}>
                                {step.date}
                              </p>
                            </div>
                            {step.completed && (
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-lg font-bold mb-4">Order Items</h4>
                  <div className="space-y-3">
                    {trackingResult.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <div>
                          <h5 className="font-semibold">{item.name}</h5>
                          <p className="text-sm text-muted-foreground">{item.size}</p>
                        </div>
                        <span className="font-semibold">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Support */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-bold text-blue-800 mb-4">Need Help with Your Order?</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="tel:+254712345678"
                      className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call Support</span>
                    </a>
                    <a 
                      href="https://wa.me/254712345678"
                      className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </a>
                    <a 
                      href="mailto:timelessstrands@outlook.com"
                      className="flex items-center justify-center space-x-2 bg-gold text-ts-black px-6 py-3 rounded-lg hover:bg-gold-dark transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Email Support</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Results */}
          {searchValue && !isLoading && !trackingResult && (
            <div className="bg-card rounded-xl shadow-elegant p-8 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Order Not Found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find an order matching your search. Please check your order number or phone number and try again.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Need help? Contact our customer support:</p>
                <div className="flex justify-center space-x-4">
                  <a href="tel:+254712345678" className="text-gold hover:text-gold-dark">
                    📞 +254 712 345 678
                  </a>
                  <a href="mailto:timelessstrands@outlook.com" className="text-gold hover:text-gold-dark">
                    ✉️ Email Support
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrackOrder;