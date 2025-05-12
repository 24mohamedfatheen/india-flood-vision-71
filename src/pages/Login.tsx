
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import SignUpForm from '@/components/SignUpForm';
import { Lock, X, Check } from 'lucide-react';
import Header from '@/components/Header';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Import background images
import bgImage1 from '/lovable-uploads/c90281c7-2f9e-4866-8432-04c64a1e399f.png';
import bgImage2 from '/lovable-uploads/2d795998-06f2-4a6c-8a40-e5e8332debc0.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showCookieDialog, setShowCookieDialog] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const bgImages = [bgImage1, bgImage2];
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signUp } = useAuth();

  // Check for cookie consent and saved credentials
  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent === null) {
      setShowCookieDialog(true);
    } else if (cookieConsent === 'accepted') {
      // Auto login if credentials exist
      const savedCredentials = localStorage.getItem('floodVisionCredentials');
      if (savedCredentials) {
        const { username, password } = JSON.parse(savedCredentials);
        autoLogin(username, password);
      }
    }

    // Rotate background image every 10 seconds
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % bgImages.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const autoLogin = async (username, password) => {
    try {
      const success = await login(username, password);
      if (success) {
        // Auto login successful - user will be redirected by the login function
      }
    } catch (error) {
      // Silent error for auto-login
      console.error("Auto-login failed", error);
    }
  };

  const handleCookieConsent = (accepted) => {
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'rejected');
    setShowCookieDialog(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Save credentials if cookie consent was accepted
        if (localStorage.getItem('cookieConsent') === 'accepted') {
          localStorage.setItem('floodVisionCredentials', JSON.stringify({ username, password }));
        }
        
        // Navigate based on user type (handled inside the login function)
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll create a random username with Google prefix
      const randomId = Math.floor(Math.random() * 10000);
      const googleUsername = `google_user_${randomId}`;
      const googlePassword = `google_pass_${Date.now()}`;
      
      // Try to sign up first (will fail if username exists, which is fine)
      await signUp(googleUsername, googlePassword);
      
      // Then try to log in
      const success = await login(googleUsername, googlePassword);
      
      if (success) {
        toast({
          title: "Google login successful",
          description: "Welcome to India Flood Vision!",
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
          title: "Google login failed",
          description: "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong with Google sign in",
        variant: "destructive",
      });
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background images with animation */}
      <div className="absolute inset-0 z-0">
        {bgImages.map((img, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentBg ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      </div>
      
      <div className="container mx-auto px-4 py-6 z-20 flex-grow flex flex-col">
        <Header />
        
        <div className="flex justify-center items-center mt-8 flex-grow">
          <Card className="w-full max-w-md bg-black/60 backdrop-blur-sm text-white border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">India Flood Vision Login</CardTitle>
              <CardDescription className="text-gray-300">
                Access flood data as a public user or government administrator
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="public">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/60">
                <TabsTrigger value="public" className="data-[state=active]:bg-blue-600">Public User</TabsTrigger>
                <TabsTrigger value="admin" className="data-[state=active]:bg-amber-600">Government/Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="public">
                <CardContent className="space-y-4 pt-4">
                  {!showSignUp ? (
                    <>
                      <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="username" className="text-gray-200">Username</Label>
                            <Input 
                              id="username" 
                              type="text" 
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                              placeholder="Enter your username"
                              className="bg-gray-800/70 border-gray-700 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="password" className="text-gray-200">Password</Label>
                            <Input 
                              id="password" 
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              placeholder="Enter your password"
                              className="bg-gray-800/70 border-gray-700 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
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
                            onClick={handleGoogleSignIn}
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
                            Sign in with Google
                          </Button>
                        </div>
                      </form>
                      
                      <div className="text-center pt-2">
                        <p className="text-sm text-gray-400">
                          Don't have an account?{" "}
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-blue-400 hover:text-blue-300"
                            onClick={() => setShowSignUp(true)}
                          >
                            Create a new account
                          </Button>
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        className="mb-2 text-gray-300 hover:text-white hover:bg-transparent p-0"
                        onClick={() => setShowSignUp(false)}
                      >
                        &larr; Back to login
                      </Button>
                      <SignUpForm />
                    </>
                  )}
                </CardContent>
              </TabsContent>
              
              <TabsContent value="admin">
                <CardContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-center mb-4 text-amber-500">
                    <Lock className="h-8 w-8" />
                  </div>
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="admin-username" className="text-gray-200">Admin Username</Label>
                        <Input 
                          id="admin-username" 
                          type="text" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          placeholder="Enter admin username"
                          className="bg-gray-800/70 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="admin-password" className="text-gray-200">Admin Password</Label>
                        <Input 
                          id="admin-password" 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Enter admin password"
                          className="bg-gray-800/70 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <Button type="submit" className="w-full" variant="destructive" disabled={isLoading}>
                        {isLoading ? "Authenticating..." : "Admin Login"}
                      </Button>
                    </div>
                  </form>
                  
                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-400">
                      Government/Admin access is restricted to authorized personnel only.
                    </p>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
              <p className="text-xs text-gray-400">
                India Flood Vision Portal &copy; 2025
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Cookie Consent Dialog */}
      <Dialog open={showCookieDialog} onOpenChange={setShowCookieDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cookie Consent</DialogTitle>
            <DialogDescription>
              We use cookies to enhance your experience and keep you logged in. 
              Do you consent to our use of cookies?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 flex-col sm:flex-row">
            <Button onClick={() => handleCookieConsent(true)} className="gap-2">
              <Check className="h-4 w-4" /> Accept Cookies
            </Button>
            <Button variant="outline" onClick={() => handleCookieConsent(false)} className="gap-2">
              <X className="h-4 w-4" /> Reject Cookies
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
