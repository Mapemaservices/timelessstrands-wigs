import React from 'react';
import { CheckCircle, Download, Clock, Phone, Mail, ShoppingBag } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface OrderData {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  cartItems: any[];
  deliveryMethod: string;
  county?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  mpesaTransactionId: string;
  orderDate: string;
}

interface OrderConfirmationProps {
  orderData: OrderData | null;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderData }) => {
  const handleDownloadReceipt = () => {
    if (!orderData) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Order Receipt', 10, 15);

    doc.setFontSize(12);
    doc.text(`Order #: ${orderData.orderNumber}`, 10, 30);
    doc.text(`Date: ${new Date(orderData.orderDate).toLocaleString('en-KE')}`, 10, 38);
    doc.text(`Name: ${orderData.customerName}`, 10, 46);
    doc.text(`Email: ${orderData.email}`, 10, 54);
    doc.text(`Phone: ${orderData.phone}`, 10, 62);
    doc.text(`Delivery: ${orderData.deliveryMethod}${orderData.county ? ' (' + orderData.county + ')' : ''}`, 10, 70);

    doc.text(`Subtotal: Ksh ${orderData.subtotal.toLocaleString()}`, 10, 78);
    doc.text(`Delivery Fee: Ksh ${orderData.deliveryFee.toLocaleString()}`, 10, 86);
    doc.text(`Total Paid: Ksh ${orderData.total.toLocaleString()}`, 10, 94);
    doc.text(`M-Pesa Transaction ID: ${orderData.mpesaTransactionId}`, 10, 102);

    doc.save(`Order_${orderData.orderNumber}_Receipt.pdf`);
  };

  if (!orderData) {
    return (
      <section id="confirmation" className="py-16 bg-gray-light">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-elegant p-8 max-w-2xl mx-auto">
            <div className="text-muted-foreground">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4" />
              <p>No order data available. Please complete your order first.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="confirmation" className="py-16 bg-gray-light">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold text-foreground font-poppins mb-4">
              Order Confirmed!
            </h2>
            <p className="text-lg text-muted-foreground">
              Thank you for your order. We'll process it within 24 hours.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-elegant overflow-hidden">
            {/* Header */}
            <div className="bg-gold p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-ts-black">Order #{orderData.orderNumber}</h3>
                  <p className="text-ts-black opacity-80">
                    Placed on {new Date(orderData.orderDate).toLocaleDateString('en-KE')}
                  </p>
                </div>
                <button
                  onClick={handleDownloadReceipt}
                  className="bg-ts-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-ts-black/80 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>

            {/* Order Content */}
            <div className="p-6 space-y-8">
              {/* Customer Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-gold" />
                    Customer Details
                  </h4>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Name:</strong> {orderData.customerName}</p>
                    <p><strong>Email:</strong> {orderData.email}</p>
                    <p><strong>Phone:</strong> {orderData.phone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gold" />
                    Delivery Information
                  </h4>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Method:</strong> {orderData.deliveryMethod === 'pickup' ? 'Store Pickup' : 'County Delivery'}</p>
                    {orderData.deliveryMethod === 'pickup' ? (
                      <p><strong>Location:</strong> StarMall C1, Nairobi</p>
                    ) : (
                      <p><strong>County:</strong> {orderData.county}</p>
                    )}
                    <p><strong>Estimated Delivery:</strong> 5-14 business days</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-bold text-lg mb-4">Order Items</h4>
                <div className="space-y-4">
                  {orderData.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-light rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold">{item.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {item.laceSize} • {item.inchSize}
                        </p>
                        <p className="text-sm">
                          <strong>Quantity:</strong> {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gold">
                          Ksh {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-light rounded-lg p-6">
                <h4 className="font-bold text-lg mb-4">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Ksh {orderData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>Ksh {orderData.deliveryFee.toLocaleString()}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-gold">
                    <span>Total Paid:</span>
                    <span>Ksh {orderData.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>M-Pesa Transaction ID:</span>
                    <span className="font-mono">{orderData.mpesaTransactionId}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-lg mb-4 text-blue-800">What happens next?</h4>
                <div className="space-y-3 text-blue-700">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                    <p>We'll verify your M-Pesa payment within 2-4 hours</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                    <p>Your order will be processed and prepared for shipping</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                    <p>We'll send you tracking information via SMS and email</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                    <p>Expect delivery within 5-14 business days</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="text-center">
                <h4 className="font-bold text-lg mb-4">Need Help?</h4>
                <div className="flex justify-center space-x-8">
                  <a 
                    href="tel:+254768174878"
                    className="flex items-center space-x-2 text-gold hover:text-gold-dark"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+254 768 174878</span>
                  </a>
                  <a 
                    href="mailto:timelessstrands@outlook.com"
                    className="flex items-center space-x-2 text-gold hover:text-gold-dark"
                  >
                    <Mail className="w-5 h-5" />
                    <span>timelessstrands@outlook.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmation;
