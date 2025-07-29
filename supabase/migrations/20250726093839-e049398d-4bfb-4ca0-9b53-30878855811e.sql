-- Enable real-time for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Add the orders table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Enable real-time for admin messages too
ALTER TABLE public.customer_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_messages;