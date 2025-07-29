import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  const commonQuestions = [
    {
      question: "What's the delivery time?",
      answer: "Delivery takes 5-14 business days within Kenya. Express delivery is available for an additional fee."
    },
    {
      question: "Do you offer returns?",
      answer: "Yes, we offer returns within 7 days of delivery. The wig must be in original condition with tags attached."
    },
    {
      question: "How do I care for my wig?",
      answer: "Gently wash with sulfate-free shampoo, condition regularly, and store on a wig stand. Avoid excessive heat styling."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept M-Pesa payments. Simply follow the payment instructions during checkout."
    },
    {
      question: "Can I track my order?",
      answer: "Yes! Use our order tracking feature with your order number or phone number to get real-time updates."
    }
  ];

  const handleWhatsAppRedirect = (message?: string) => {
    const phone = "+254768174878";
    const defaultMessage = message || customMessage || "Hi! I need help with Timeless Strands wigs.";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-elegant border z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="bg-gold text-ts-black p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-ts-black w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-gold font-bold">TS</span>
              </div>
              <div>
                <h3 className="font-bold">Timeless Strands Support</h3>
                <p className="text-sm opacity-90">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ts-black hover:bg-ts-black hover:text-gold p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {!selectedQuestion ? (
              <>
                <div className="text-center mb-4">
                  <p className="text-muted-foreground">
                    Hi! How can we help you today? Choose a common question or send us a custom message.
                  </p>
                </div>

                {/* Common Questions */}
                <div className="space-y-2">
                  {commonQuestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedQuestion(item.question)}
                      className="w-full text-left p-3 bg-gray-light hover:bg-gold hover:text-ts-black rounded-lg transition-colors text-sm"
                    >
                      {item.question}
                    </button>
                  ))}
                </div>

                {/* Custom Message */}
                <div className="border-t pt-4">
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-3 border border-border rounded-lg resize-none h-20 focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                  <button
                    onClick={() => handleWhatsAppRedirect()}
                    className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Answer Display */}
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className="text-gold hover:text-gold-dark text-sm"
                  >
                    ← Back to questions
                  </button>
                  
                  <div className="bg-gold text-ts-black p-3 rounded-lg">
                    <p className="font-semibold mb-2">{selectedQuestion}</p>
                  </div>
                  
                  <div className="bg-gray-light p-3 rounded-lg">
                    <p className="text-sm">
                      {commonQuestions.find(q => q.question === selectedQuestion)?.answer}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Need more help? Contact us directly on WhatsApp!
                    </p>
                    <button
                      onClick={() => handleWhatsAppRedirect(`I have a question about: ${selectedQuestion}`)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Contact on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-light p-3 rounded-b-2xl text-center">
            <p className="text-xs text-muted-foreground">
              Available 24/7 via WhatsApp: +254 768 174 878
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;