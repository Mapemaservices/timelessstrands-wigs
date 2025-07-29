import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, MapPin, Phone, Mail, CreditCard, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  name: string;
  image: string;
  laceSize: string;
  inchSize: string;
  price: number;
  quantity: number;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  onOrderSubmit: (orderData: any) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems, onOrderSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    deliveryMethod: '',
    county: '',
    mpesaTransactionId: ''
  });

  const [deliveryFee, setDeliveryFee] = useState(0);

  // ADMIN SECTION: Edit County Delivery Fees Here
  const countyDeliveryFees: { [key: string]: number } = {
    'nairobi': 200,
    'kiambu': 300,
    'machakos': 350,
    'kajiado': 400,
    'murang\'a': 450,
    'nakuru': 500,
    'mombasa': 600,
    'kisumu': 700,
    'eldoret': 750,
    'thika': 300,
    'nyeri': 400,
    'meru': 600,
    'embu': 500,
    'garissa': 800,
    'kakamega': 650,
    'busia': 700,
    'kitale': 750,
    'malindi': 650,
    'lamu': 900,
    'isiolo': 600
  };

  const counties = Object.keys(countyDeliveryFees).map(county => ({
    value: county,
    label: `${county.charAt(0).toUpperCase() + county.slice(1)} - Ksh ${countyDeliveryFees[county]}`,
    fee: countyDeliveryFees[county]
  }));

  useEffect(() => {
    if (formData.deliveryMethod === 'pickup') {
      setDeliveryFee(120); // Fixed pickup fee
    } else if (formData.deliveryMethod === 'delivery' && formData.county) {
      setDeliveryFee(countyDeliveryFees[formData.county] || 0);
    } else {
      setDeliveryFee(0);
    }
  }, [formData.deliveryMethod, formData.county]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.email || !formData.phone || !formData.deliveryMethod || !formData.mpesaTransactionId) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.deliveryMethod === 'delivery' && !formData.county) {
      alert('Please select a county for delivery');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const orderData = {
      ...formData,
      cartItems,
      subtotal,
      deliveryFee,
      total,
      orderNumber: `TS${Date.now()}`,
      orderDate: new Date().toISOString(),
      status: 'pending'
    };

    // Save order to database
    try {
      const dbOrderData = {
        order_number: orderData.orderNumber,
        customer_name: orderData.customerName,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        cart_items: orderData.cartItems as any,
        delivery_method: orderData.deliveryMethod,
        county: orderData.county,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        total: orderData.total,
        mpesa_transaction_id: orderData.mpesaTransactionId,
        status: orderData.status
      };
      
      await supabase
        .from('orders')
        .insert([dbOrderData]);
      console.log('Order saved to database');
    } catch (error) {
      console.error('Failed to save order to database:', error);
      // Don't block the order process if database save fails
    }

    // Send comprehensive order notifications (Telegram + Admin alerts)
    try {
      const { data, error } = await supabase.functions.invoke('send-order-to-telegram', {
        body: orderData
      });
      
      if (data?.success) {
        console.log('✅ Order notifications sent successfully:', data.notifications);
        if (data.notifications?.telegram) {
          toast.success('Order confirmation sent to WhatsApp/Telegram!');
        }
      } else {
        console.warn('⚠️ Some notifications failed:', data?.details);
        // Still show success since order was saved to database
      }
    } catch (error) {
      console.error('❌ Failed to send order notifications:', error);
      // Don't block the order process if notifications fail
      toast.warning('Order saved, but notifications may be delayed.');
    }

    onOrderSubmit(orderData);

    // Scroll to confirmation
    const element = document.getElementById('confirmation');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="checkout" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground font-poppins mb-4">
            Complete Your Order
          </h2>
          <p className="text-lg text-muted-foreground">
            Fill in your details to place your order. We'll contact you for confirmation.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-elegant p-6 sticky top-24">
              <h3 className="text-xl font-bold text-card-foreground mb-6 flex items-center">
                <ShoppingBag className="w-6 h-6 mr-2 text-gold" />
                Order Summary
              </h3>

              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <button 
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-gold hover:text-gold-dark font-semibold mt-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.laceSize} • {item.inchSize}
                        </p>
                        <p className="text-sm font-bold text-gold">
                          Ksh {item.price.toLocaleString()} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Pricing Breakdown */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>Ksh {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>
                        {deliveryFee > 0 ? `Ksh ${deliveryFee.toLocaleString()}` : 'Select method'}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gold border-t pt-2">
                      <span>Total:</span>
                      <span>Ksh {total.toLocaleString()}</span>
                    </div>
                  </div>
                  {/* Mpesa STK Push Option */}
                  <div className="mt-6 p-4 border rounded bg-green-50">
                    <h4 className="font-semibold text-green-800 mb-2">Quick M-Pesa Payment</h4>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const phone = formData.get('phone') as string;
                        if (!phone.match(/^07\d{8}$/)) {
                          alert('Enter a valid Safaricom number (07XXXXXXXX)');
                          return;
                        }
                        alert('Sending payment prompt...');
                        // TODO: Replace with real STK Push API call
                        await new Promise(res => setTimeout(res, 1500));
                        alert(`Payment prompt sent to ${phone} for Ksh ${total}`);
                      }}
                    >
                      <label className="block text-sm font-semibold text-green-800 mb-2" htmlFor="phone">
                        Enter your M-Pesa phone number
                      </label>
                      <div className="flex gap-2">
                        <input name="phone" type="tel" placeholder="07XXXXXXXX" required className="flex-1 p-3 border border-green-300 rounded-lg" />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">Pay</button>
                      </div>
                      <div className="text-xs text-green-700 mt-1">You will receive a prompt on your phone. Enter your PIN to complete payment.</div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div className="bg-card rounded-xl shadow-elegant p-6">
                <h3 className="text-xl font-bold text-card-foreground mb-6 flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-gold" />
                  Customer Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full p-3 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254 712 345 678"
                      className="w-full p-3 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full p-3 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-card rounded-xl shadow-elegant p-6">
                <h3 className="text-xl font-bold text-card-foreground mb-6 flex items-center">
                  <Truck className="w-6 h-6 mr-2 text-gold" />
                  Delivery Method
                </h3>

                <div className="space-y-4">
                  {/* Pickup Option */}
                  <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-gold transition-colors">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      onChange={handleInputChange}
                      className="text-gold focus:ring-gold"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Pickup at Store</h4>
                          <p className="text-sm text-muted-foreground">
                            StarMall C1, Nairobi
                          </p>
                        </div>
                        <span className="font-bold text-gold">Ksh 120</span>
                      </div>
                    </div>
                  </label>

                  {/* Delivery Option */}
                  <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-gold transition-colors">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="delivery"
                      onChange={handleInputChange}
                      className="text-gold focus:ring-gold"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">County Delivery</h4>
                          <p className="text-sm text-muted-foreground">
                            5-14 business days
                          </p>
                        </div>
                        <span className="font-bold text-gold">
                          {formData.deliveryMethod === 'delivery' && formData.county 
                            ? `Ksh ${countyDeliveryFees[formData.county]}` 
                            : 'Select county'
                          }
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* County Selection */}
                  {formData.deliveryMethod === 'delivery' && (
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Select County *
                      </label>
                      <select
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20"
                        required
                      >
                        <option value="">Choose your county</option>
                        {counties.map(county => (
                          <option key={county.value} value={county.value}>
                            {county.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-card rounded-xl shadow-elegant p-6">
                <h3 className="text-xl font-bold text-card-foreground mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2 text-gold" />
                  Payment Information
                </h3>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">M-Pesa Payment Instructions</h4>
                      <ol className="text-sm text-green-700 mt-2 space-y-1">
                        <li>1. Go to M-Pesa on your phone</li>
                        <li>2. Select "Lipa na M-Pesa"</li>
                        <li>3. Select "Pay Bill"</li>
                        <li>4. Business No: <strong>522522</strong></li>
                        <li>5. Account: <strong>1342330668</strong></li>
                        <li>6. Amount: <strong>Ksh {total.toLocaleString()}</strong></li>
                        <li>7. Enter your M-Pesa PIN and confirm</li>
                        <li>8. Copy the transaction ID below</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    M-Pesa Transaction ID *
                  </label>
                  <input
                    type="text"
                    name="mpesaTransactionId"
                    value={formData.mpesaTransactionId}
                    onChange={handleInputChange}
                    placeholder="e.g. RBK1A2B3C4"
                    className="w-full p-3 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the transaction ID you received from M-Pesa
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={cartItems.length === 0}
                className="w-full bg-gold hover:bg-gold-dark disabled:bg-gray-medium disabled:cursor-not-allowed text-ts-black font-bold py-4 rounded-lg text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-6 h-6" />
                <span>Place Order - Ksh {total.toLocaleString()}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutForm;
