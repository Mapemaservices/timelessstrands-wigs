import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, Settings2, Phone, Mail, MapPin, Clock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
}

const SiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      const settingsMap = (data || []).reduce((acc, setting) => {
        acc[setting.setting_key] = typeof setting.setting_value === 'string' 
          ? setting.setting_value.replace(/^"|"$/g, '') // Remove quotes from JSON strings
          : setting.setting_value;
        return acc;
      }, {});

      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to fetch site settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key,
          setting_value: JSON.stringify(value),
          description: getSettingDescription(key)
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const getSettingDescription = (key: string): string => {
    const descriptions: { [key: string]: string } = {
      'hero_title': 'Main hero section title',
      'hero_subtitle': 'Hero section subtitle',
      'contact_phone': 'Primary contact phone number',
      'contact_email': 'Primary contact email',
      'business_address': 'Business address',
      'delivery_time': 'Standard delivery time',
      'mpesa_paybill': 'M-Pesa Paybill number',
      'mpesa_account': 'M-Pesa account number'
    };
    return descriptions[key] || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update all settings
    const updatePromises = Object.entries(settings).map(([key, value]) => 
      updateSetting(key, value)
    );

    try {
      await Promise.all(updatePromises);
      toast.success('All settings updated successfully');
    } catch (error) {
      toast.error('Some settings failed to update');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading site settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Site Configuration
          </CardTitle>
          <CardDescription>
            Manage your website content and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hero Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Hero Section</h3>
              
              <div className="space-y-2">
                <Label htmlFor="hero_title">Hero Title</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                  placeholder="Main hero section title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                <Textarea
                  id="hero_subtitle"
                  value={settings.hero_subtitle || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                  placeholder="Hero section subtitle text"
                  rows={3}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="+254768174878"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="timelessstrands@outlook.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_address">Business Address</Label>
                <Input
                  id="business_address"
                  value={settings.business_address || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, business_address: e.target.value }))}
                  placeholder="StarMall C1, Nairobi, Kenya"
                />
              </div>
            </div>

            {/* Delivery Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Delivery Settings
              </h3>

              <div className="space-y-2">
                <Label htmlFor="delivery_time">Standard Delivery Time</Label>
                <Input
                  id="delivery_time"
                  value={settings.delivery_time || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, delivery_time: e.target.value }))}
                  placeholder="5-14 business days"
                />
              </div>
            </div>

            {/* Payment Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mpesa_paybill">M-Pesa Paybill Number</Label>
                  <Input
                    id="mpesa_paybill"
                    value={settings.mpesa_paybill || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, mpesa_paybill: e.target.value }))}
                    placeholder="522522"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mpesa_account">M-Pesa Account Number</Label>
                  <Input
                    id="mpesa_account"
                    value={settings.mpesa_account || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, mpesa_account: e.target.value }))}
                    placeholder="1342330668"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save All Settings'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;