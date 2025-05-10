
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import SignUpForm from '@/components/SignUpForm';
import { Lock } from 'lucide-react';
import Header from '@/components/Header';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <div className="flex justify-center items-center mt-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">India Flood Vision Login</CardTitle>
              <CardDescription>
                Access flood data as a public user or government administrator
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="public">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="public">Public User</TabsTrigger>
                <TabsTrigger value="admin">Government/Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="public">
                <CardContent className="space-y-4 pt-4">
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          type="text" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          placeholder="Enter your username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Enter your password"
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    </div>
                  </form>
                  
                  <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?
                    </p>
                  </div>
                  
                  <SignUpForm />
                </CardContent>
              </TabsContent>
              
              <TabsContent value="admin">
                <CardContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-center mb-4 text-amber-600">
                    <Lock className="h-8 w-8" />
                  </div>
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="admin-username">Admin Username</Label>
                        <Input 
                          id="admin-username" 
                          type="text" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          placeholder="Enter admin username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="admin-password">Admin Password</Label>
                        <Input 
                          id="admin-password" 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Enter admin password"
                        />
                      </div>
                      <Button type="submit" className="w-full" variant="destructive" disabled={isLoading}>
                        {isLoading ? "Authenticating..." : "Admin Login"}
                      </Button>
                    </div>
                  </form>
                  
                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground">
                      Government/Admin access is restricted to authorized personnel only.
                    </p>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-xs text-muted-foreground">
                India Flood Vision Portal &copy; 2025
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
