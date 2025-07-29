import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, ShoppingBag, MessageSquare, Settings, Send, Package, Calendar, Phone, Mail, Edit2, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  phone?: string;
}

interface UserOrder {
  id: string;
  order_number: string;
  cart_items: any[];
  total: number;
  status: string;
  created_at: string;
  delivery_method: string;
  county?: string;
}

interface UserMessage {
  id: string;
  subject: string;
  message: string;
  status: string;
  admin_response?: string;
  created_at: string;
}

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newMessage, setNewMessage] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    initializeUserData();
    subscribeToUpdates();
  }, []);

  const initializeUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      } else {
        // Create profile if doesn't exist
        const newProfile = {
          user_id: user.id,
          display_name: user.user_metadata?.display_name || '',
          phone: user.user_metadata?.phone || ''
        };
        const { data } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();
        setProfile(data);
      }

      // Fetch user orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });

      setOrders((ordersData || []) as UserOrder[]);

      // Fetch user messages
      const { data: messagesData } = await supabase
        .from('customer_messages')
        .select('*')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });

      setMessages((messagesData || []) as UserMessage[]);

    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('user-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'customer_messages' }, 
        () => initializeUserData())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, 
        () => initializeUserData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const updateProfile = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          phone: profile.phone
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.subject || !newMessage.message) {
      toast.error('Please fill in both subject and message');
      return;
    }

    try {
      setSending(true);
      
      const { error } = await supabase
        .from('customer_messages')
        .insert([{
          customer_name: profile?.display_name || user?.user_metadata?.display_name || 'User',
          customer_email: user.email,
          customer_phone: profile?.phone,
          subject: newMessage.subject,
          message: newMessage.message
        }]);

      if (error) throw error;

      toast.success('Message sent to admin successfully');
      setNewMessage({ subject: '', message: '' });
      initializeUserData(); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: 'bg-yellow-500', label: 'Pending' },
      confirmed: { color: 'bg-blue-500', label: 'Confirmed' },
      processing: { color: 'bg-purple-500', label: 'Processing' },
      shipped: { color: 'bg-orange-500', label: 'Shipped' },
      delivered: { color: 'bg-green-500', label: 'Delivered' },
      cancelled: { color: 'bg-red-500', label: 'Cancelled' },
      unread: { color: 'bg-gray-500', label: 'Sent' },
      read: { color: 'bg-blue-500', label: 'Read' },
      replied: { color: 'bg-green-500', label: 'Replied' }
    };
    
    const config = configs[status as keyof typeof configs] || { color: 'bg-gray-500', label: status };
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-gold" />
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.display_name || user?.user_metadata?.display_name || 'User'}!</h1>
            <p className="text-muted-foreground">Manage your orders, profile, and communicate with our team</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Ksh {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{messages.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {messages.filter(m => m.status === 'replied').length} replied
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg mb-2">
                    <div>
                      <p className="font-medium">Order #{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()} • Ksh {order.total.toLocaleString()}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No orders yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View all your orders and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold">Order #{order.order_number}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('en-KE')}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        
                        <div className="space-y-2">
                          {order.cart_items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} ({item.laceSize}, {item.inchSize}) x{item.quantity}</span>
                              <span>Ksh {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <span className="font-medium">Total: Ksh {order.total.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground">
                            {order.delivery_method === 'pickup' ? 'Store Pickup' : `Delivery to ${order.county}`}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Send New Message */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Admin</CardTitle>
                  <CardDescription>Send a message to our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={newMessage.message}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="How can we help you?"
                      rows={4}
                    />
                  </div>
                  <Button onClick={sendMessage} disabled={sending} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                </CardContent>
              </Card>

              {/* Message History */}
              <Card>
                <CardHeader>
                  <CardTitle>Message History</CardTitle>
                  <CardDescription>Your conversations with our team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{message.subject}</h5>
                          {getStatusBadge(message.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{message.message}</p>
                        {message.admin_response && (
                          <div className="bg-blue-50 p-3 rounded-md mt-2">
                            <p className="text-sm font-medium text-blue-800">Admin Reply:</p>
                            <p className="text-sm text-blue-700">{message.admin_response}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(message.created_at).toLocaleString('en-KE')}
                        </p>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <p className="text-center text-muted-foreground">No messages yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user?.email || ''} disabled />
                  </div>
                  
                  <div>
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      value={profile?.display_name || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, display_name: e.target.value } : null)}
                      disabled={!editingProfile}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile?.phone || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      disabled={!editingProfile}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {editingProfile ? (
                    <>
                      <Button onClick={updateProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditingProfile(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditingProfile(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;