
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp, login } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const success = await signUp(username, password);
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "You can now login with your credentials",
        });
        
        // Auto-login after successful registration
        try {
          await login(username, password);
          
          // Save credentials if cookie consent was accepted
          if (localStorage.getItem('cookieConsent') === 'accepted') {
            localStorage.setItem('floodVisionCredentials', JSON.stringify({ username, password }));
          }
        } catch (loginError) {
          console.error("Auto-login after signup failed:", loginError);
        }
      } else {
        toast({
          title: "Registration failed",
          description: "Username may already be taken",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll create a random username with Google prefix
      const randomId = Math.floor(Math.random() * 10000);
      const googleUsername = `google_user_${randomId}`;
      const googlePassword = `google_pass_${Date.now()}`;
      
      // Try to sign up
      const success = await signUp(googleUsername, googlePassword);
      
      if (success) {
        // Auto login
        await login(googleUsername, googlePassword);
        
        toast({
          title: "Google registration successful",
          description: "You are now logged in!",
        });
        
        // Save credentials if cookie consent was accepted
        if (localStorage.getItem('cookieConsent') === 'accepted') {
          localStorage.setItem('floodVisionCredentials', JSON.stringify({ 
            username: googleUsername, 
            password: googlePassword 
          }));
        }
      } else {
        toast({
          title: "Google registration failed",
          description: "Please try again or use email registration",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong with Google sign up",
        variant: "destructive",
      });
      console.error("Google sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-2">
      <h3 className="text-sm font-medium mb-4 text-gray-200">Create a new account</h3>
      <form onSubmit={handleSignUp} className="space-y-3">
        <div>
          <Label htmlFor="signup-username" className="text-gray-200">Username</Label>
          <Input 
            id="signup-username" 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
            className="bg-gray-800/70 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="signup-password" className="text-gray-200">Password</Label>
          <Input 
            id="signup-password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Choose a password"
            className="bg-gray-800/70 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="confirm-password" className="text-gray-200">Confirm Password</Label>
          <Input 
            id="confirm-password" 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
            className="bg-gray-800/70 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
        
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-gray-600 text-white hover:bg-gray-700"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Sign up with Google
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
