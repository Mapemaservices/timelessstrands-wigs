import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Reply, Mail, Phone, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerMessage {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  admin_response?: string;
  created_at: string;
  updated_at: string;
}

const CustomerSupport: React.FC = () => {
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<CustomerMessage | null>(null);
  const [response, setResponse] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages((data || []) as CustomerMessage[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch customer messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('customer_messages')
        .update({ status: 'read' })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'read' as const } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendResponse = async () => {
    if (!selectedMessage || !response.trim()) return;

    try {
      setSending(true);
      
      const { error } = await supabase
        .from('customer_messages')
        .update({ 
          admin_response: response,
          status: 'replied'
        })
        .eq('id', selectedMessage.id);

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === selectedMessage.id 
          ? { ...msg, admin_response: response, status: 'replied' as const }
          : msg
      ));

      toast.success('Response sent successfully');
      setResponse('');
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      unread: { color: 'bg-red-500', label: 'Unread' },
      read: { color: 'bg-yellow-500', label: 'Read' },
      replied: { color: 'bg-green-500', label: 'Replied' }
    };
    
    const config = configs[status as keyof typeof configs] || configs.unread;
    
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
          <p className="mt-4 text-muted-foreground">Loading customer messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Mail className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {messages.filter(m => m.status === 'unread').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Reply className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {messages.length > 0 
                ? Math.round((messages.filter(m => m.status === 'replied').length / messages.length) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Management */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Messages</CardTitle>
          <CardDescription>Manage customer inquiries and support requests</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search messages, customers, or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'unread', 'read', 'replied'].map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card key={message.id} className={`${message.status === 'unread' ? 'border-l-4 border-l-red-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{message.subject}</h4>
                        {getStatusBadge(message.status)}
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {message.customer_name} ({message.customer_email})
                          </span>
                          {message.customer_phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {message.customer_phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(message.created_at).toLocaleDateString('en-KE')}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm mb-3 line-clamp-2">{message.message}</p>

                      {message.admin_response && (
                        <div className="bg-blue-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-blue-800 mb-1">Admin Response:</p>
                          <p className="text-sm text-blue-700">{message.admin_response}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedMessage(message);
                              if (message.status === 'unread') {
                                markAsRead(message.id);
                              }
                            }}
                          >
                            View & Reply
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Customer Message</DialogTitle>
                          </DialogHeader>
                          
                          {selectedMessage && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h4 className="font-semibold">{selectedMessage.subject}</h4>
                                <div className="text-sm text-muted-foreground">
                                  From: {selectedMessage.customer_name} ({selectedMessage.customer_email})
                                  {selectedMessage.customer_phone && (
                                    <span> • Phone: {selectedMessage.customer_phone}</span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Date: {new Date(selectedMessage.created_at).toLocaleString('en-KE')}
                                </div>
                              </div>

                              <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                              </div>

                              {selectedMessage.admin_response && (
                                <div className="bg-blue-50 p-4 rounded-md">
                                  <p className="text-sm font-medium text-blue-800 mb-2">Previous Response:</p>
                                  <p className="text-sm text-blue-700 whitespace-pre-wrap">{selectedMessage.admin_response}</p>
                                </div>
                              )}

                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  {selectedMessage.admin_response ? 'Update Response:' : 'Send Response:'}
                                </label>
                                <Textarea
                                  value={response}
                                  onChange={(e) => setResponse(e.target.value)}
                                  placeholder="Type your response here..."
                                  rows={4}
                                />
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={sendResponse}
                                  disabled={!response.trim() || sending}
                                  className="flex items-center gap-2"
                                >
                                  <Send className="w-4 h-4" />
                                  {sending ? 'Sending...' : 'Send Response'}
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No messages found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSupport;