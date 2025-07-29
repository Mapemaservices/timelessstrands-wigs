import React, { useState } from 'react';
import { Tag, Gift, Clock, Percent, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minPurchase: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  category?: string;
}

interface CouponSystemProps {
  onApplyCoupon?: (coupon: Coupon) => void;
}

const CouponSystem: React.FC<CouponSystemProps> = ({ onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mock coupons data
  const availableCoupons: Coupon[] = [
    {
      id: '1',
      code: 'WELCOME20',
      title: 'Welcome Offer',
      description: 'Get 20% off on your first purchase',
      discount: 20,
      type: 'percentage',
      minPurchase: 5000,
      expiryDate: '2024-12-31',
      usageLimit: 100,
      usedCount: 45
    },
    {
      id: '2',
      code: 'SAVE1000',
      title: 'Fixed Discount',
      description: 'Save Ksh 1,000 on orders above Ksh 10,000',
      discount: 1000,
      type: 'fixed',
      minPurchase: 10000,
      expiryDate: '2024-11-30',
      usageLimit: 50,
      usedCount: 23
    },
    {
      id: '3',
      code: 'WEEKEND15',
      title: 'Weekend Special',
      description: '15% off on weekend orders',
      discount: 15,
      type: 'percentage',
      minPurchase: 3000,
      expiryDate: '2024-10-31',
      usageLimit: 200,
      usedCount: 67,
      category: 'weekend'
    },
    {
      id: '4',
      code: 'FREESHIP',
      title: 'Free Shipping',
      description: 'Free shipping on all orders',
      discount: 500,
      type: 'fixed',
      minPurchase: 2000,
      expiryDate: '2024-12-15',
      usageLimit: 1000,
      usedCount: 234
    }
  ];

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());
    
    if (!coupon) {
      toast.error('Invalid coupon code');
      return;
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      toast.error('Coupon has expired');
      return;
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      toast.error('Coupon usage limit reached');
      return;
    }

    setAppliedCoupon(coupon);
    if (onApplyCoupon) onApplyCoupon(coupon);
    toast.success(`Coupon applied! You saved ${coupon.type === 'percentage' ? `${coupon.discount}%` : `Ksh ${coupon.discount}`}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Coupon code copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <div className="space-y-6">
      {/* Coupon Input */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-bold text-card-foreground mb-4 flex items-center space-x-2">
          <Tag className="w-5 h-5 text-gold" />
          <span>Apply Coupon</span>
        </h3>
        
        {appliedCoupon ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">{appliedCoupon.code}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Applied
                  </Badge>
                </div>
                <p className="text-sm text-green-700 mt-1">{appliedCoupon.description}</p>
                <p className="text-sm font-semibold text-green-800 mt-1">
                  You save: {appliedCoupon.type === 'percentage' 
                    ? `${appliedCoupon.discount}%` 
                    : `Ksh ${appliedCoupon.discount.toLocaleString()}`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20"
              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim()}
              className="bg-gold hover:bg-gold-dark text-ts-black px-6"
            >
              Apply
            </Button>
          </div>
        )}
      </div>

      {/* Available Coupons */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-bold text-card-foreground mb-4 flex items-center space-x-2">
          <Gift className="w-5 h-5 text-gold" />
          <span>Available Coupons</span>
        </h3>
        
        <div className="space-y-3">
          {availableCoupons.map((coupon) => (
            <div 
              key={coupon.id}
              className="border border-border rounded-lg p-4 hover:border-gold transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-gold text-ts-black px-3 py-1 rounded-lg font-mono font-bold text-sm">
                      {coupon.code}
                    </div>
                    <span className="font-semibold text-card-foreground">{coupon.title}</span>
                    {isExpiringSoon(coupon.expiryDate) && (
                      <Badge variant="destructive" className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Expiring Soon</span>
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{coupon.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Percent className="w-3 h-3" />
                      <span>
                        {coupon.type === 'percentage' 
                          ? `${coupon.discount}% off` 
                          : `Ksh ${coupon.discount.toLocaleString()} off`}
                      </span>
                    </span>
                    <span>Min: Ksh {coupon.minPurchase.toLocaleString()}</span>
                    <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                    <span>{coupon.usageLimit - coupon.usedCount} left</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyCode(coupon.code)}
                    className="flex items-center space-x-1"
                  >
                    {copiedCode === coupon.code ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      {copiedCode === coupon.code ? 'Copied' : 'Copy'}
                    </span>
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => {
                      setCouponCode(coupon.code);
                      handleApplyCoupon();
                    }}
                    disabled={appliedCoupon?.id === coupon.id}
                    className="bg-gold hover:bg-gold-dark text-ts-black"
                  >
                    {appliedCoupon?.id === coupon.id ? 'Applied' : 'Use'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponSystem;