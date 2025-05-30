import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { LogIn, Home } from 'lucide-react';
import { useTestAuth } from '@/hooks/useTestAuth';
import { useToast } from '@/hooks/use-toast';

const AgentLogin = () => {
  const [email, setEmail] = useState('m@hh.dk');
  const [password, setPassword] = useState('12345678');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useTestAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        toast({
          title: "Login fejlede",
          description: result.error || "Ugyldige loginoplysninger",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login fejlede",
        description: "Der opstod en fejl under login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Log ind som mægler
            </h1>
            <p className="text-gray-600">
              Få adgang til din portefølje og nye sager.
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Velkommen tilbage</CardTitle>
              <CardDescription className="text-center">
                Indtast dine oplysninger for at logge ind.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="din@email.dk" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Adgangskode</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Din adgangskode" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="mt-1"
                  />
                </div>
                <Button
                  disabled={isLoading}
                  className="w-full"
                  type="submit"
                >
                  {isLoading ? "Logger ind..." : "Log ind"}
                </Button>
              </form>
              <div className="flex justify-between mt-4">
                <Link
                  to="/"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <Home className="w-4 h-4 mr-1" /> Til forsiden
                </Link>
                <Link
                  to="/saelger/opret-bruger"
                  className="text-blue-600 hover:underline"
                >
                  Opret sælger-bruger
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AgentLogin;
