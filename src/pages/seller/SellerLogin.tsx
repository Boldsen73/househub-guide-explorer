import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getTestUsers } from '@/utils/testData'; // ✅ Korrekt import

const SellerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = getTestUsers().find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password &&
          u.role === 'seller'
      );

      if (!user) {
        toast({
          title: 'Login fejlede',
          description: 'Forkert e-mail eller adgangskode.',
          variant: 'destructive',
        });
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('seller_profile', JSON.stringify(user));

      toast({
        title: 'Login succesfuldt',
        description: `Velkommen, ${user.name}.`,
      });

      navigate('/seller/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login fejlede',
        description: 'Der opstod en fejl under login',
        variant: 'destructive',
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Log ind som sælger</h1>
            <p className="text-gray-600">Få adgang til din sag og se status.</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Velkommen tilbage</CardTitle>
              <CardDescription className="text-center"></CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Adgangskode</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logger ind...' : 'Log ind'}
                </Button>

                <div className="text-center text-sm mt-4">
                  <span>Har du ikke en konto? </span>
                  <Link to="/seller/signup" className="text-blue-600 hover:underline">
                    Opret bruger
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerLogin;
