import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const subjectOptions = [
    'General Inquiry',
    'Product Question',
    'Order Support',
    'Technical Issue',
    'Complaint',
    'Compliment',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('customer_messages')
        .insert([{
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone || null,
          subject: formData.subject,
          message: formData.message
        }]);

      if (error) throw error;

      setSubmitted(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Message Sent Successfully!</h3>
          <p className="text-muted-foreground mb-6">
            Thank you for contacting us. We've received your message and will get back to you within 24 hours.
          </p>
          <Button onClick={() => setSubmitted(false)}>
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              We're here to help! Reach out to us through any of these channels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-gold w-12 h-12 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-ts-black" />
              </div>
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="text-muted-foreground">+254 768 174878</p>
                <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM EAT</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-gold w-12 h-12 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-ts-black" />
              </div>
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-muted-foreground">timelessstrands@outlook.com</p>
                <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-gold w-12 h-12 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-ts-black" />
              </div>
              <div>
                <h4 className="font-semibold">Visit Our Store</h4>
                <p className="text-muted-foreground">StarMall C1, Nairobi, Kenya</p>
                <p className="text-sm text-muted-foreground">Mon-Sat, 10AM-8PM</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/TimelessStrands" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold-dark transition-colors"
                >
                  <span className="text-ts-black font-bold">f</span>
                </a>
                <a 
                  href="https://www.instagram.com/_timeless.strands" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold-dark transition-colors"
                >
                  <span className="text-ts-black font-bold">@</span>
                </a>
                <a 
                  href="https://www.tiktok.com/@Timeless_Strands" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <span className="text-white font-bold">T</span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email Address *</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number (Optional)</Label>
                <Input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full flex items-center gap-2" 
                disabled={submitting}
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactForm;