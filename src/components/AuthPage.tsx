import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      onAuthSuccess();
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: formData.displayName,
            phone: formData.phone
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      
      setIsSignUp(false);
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) throw error;

      toast({
        title: "Reset email sent!",
        description: "Check your email for password reset instructions.",
      });
      
      setIsResetPassword(false);
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-elegant p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-ts-black font-bold text-2xl">TS</span>
            </div>
            <h2 className="text-3xl font-bold text-ts-black font-poppins">
              {isResetPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isResetPassword 
                ? 'Enter your email to reset your password'
                : isSignUp 
                ? 'Join Timeless Strands today'
                : 'Sign in to your account'
              }
            </p>
          </div>

          {/* Back Button for Reset Password */}
          {isResetPassword && (
            <button
              onClick={() => setIsResetPassword(false)}
              className="flex items-center text-gold hover:text-gold-dark mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </button>
          )}

          {/* Forms */}
          <form onSubmit={isResetPassword ? handleResetPassword : isSignUp ? handleSignUp : handleSignIn} className="space-y-6">
            {/* Display Name - Sign Up Only */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-ts-black mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20"
                    required
                  />
                </div>
              </div>
            )}

            {/* Phone - Sign Up Only */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-ts-black mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+254 712 345 678"
                    className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-ts-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20"
                  required
                />
              </div>
            </div>

            {/* Password - Not for Reset */}
            {!isResetPassword && (
              <div>
                <label className="block text-sm font-semibold text-ts-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border border-border rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-gold"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-dark disabled:opacity-50 text-ts-black font-bold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              {loading ? 'Please wait...' : isResetPassword ? 'Send Reset Email' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            {!isResetPassword && (
              <>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-gold hover:text-gold-dark font-semibold"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
                
                {!isSignUp && (
                  <div>
                    <button
                      onClick={() => setIsResetPassword(true)}
                      className="text-muted-foreground hover:text-gold text-sm"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;