-- Create orders table for sales monitoring
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  cart_items JSONB NOT NULL,
  delivery_method TEXT NOT NULL,
  county TEXT,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  mpesa_transaction_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table for content management
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer_messages table for support
CREATE TABLE public.customer_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_history table for tracking order changes
CREATE TABLE public.order_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status_from TEXT,
  status_to TEXT NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Admins can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for site_settings
CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Everyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- RLS Policies for customer_messages
CREATE POLICY "Admins can manage customer messages" 
ON public.customer_messages 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Anyone can create customer messages" 
ON public.customer_messages 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for order_history
CREATE POLICY "Admins can manage order history" 
ON public.order_history 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

-- Add triggers for updated_at columns
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_messages_updated_at
BEFORE UPDATE ON public.customer_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES
('hero_title', '"Discover Your Perfect Wig Collection"', 'Main hero section title'),
('hero_subtitle', '"Premium human hair wigs from Brazil, Peru, Vietnam & India. Transform your look with our curated collection of luxury lace fronts, full lace, and closure wigs."', 'Hero section subtitle'),
('contact_phone', '"+254768174878"', 'Primary contact phone number'),
('contact_email', '"timelessstrands@outlook.com"', 'Primary contact email'),
('business_address', '"StarMall C1, Nairobi, Kenya"', 'Business address'),
('delivery_time', '"5-14 business days"', 'Standard delivery time'),
('mpesa_paybill', '"522522"', 'M-Pesa Paybill number'),
('mpesa_account', '"1342330668"', 'M-Pesa account number');