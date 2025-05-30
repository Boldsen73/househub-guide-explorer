
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { addUser } from '@/utils/userData';
import { useAuth } from '@/hooks/useAuth';
import PersonalInfoSection from '@/components/agent/signup/PersonalInfoSection';
import ProfessionalInfoSection from '@/components/agent/signup/ProfessionalInfoSection';
import SecuritySection from '@/components/agent/signup/SecuritySection';
import { formatPhoneNumber, validateAgentSignupForm } from '@/utils/agentSignupValidation';

const AgentSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agency: '',
    primaryRegion: '',
    specialties: [] as string[],
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialties: checked
        ? [...prev.specialties, specialty]
        : prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateAgentSignupForm(formData, acceptedTerms);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Fejl i formularen",
        description: "Ret venligst fejlene og prøv igen.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create new agent user
      const newAgent = {
        id: `agent-${Date.now()}`,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'agent' as const,
        phone: formData.phone,
        company: formData.agency,
        primaryRegion: formData.primaryRegion,
        specialties: formData.specialties
      };

      // Add to users
      addUser(newAgent);
      
      // Auto-login the new user
      const loginResult = await login(formData.email, formData.password);
      
      if (loginResult.success) {
        toast({
          title: "Profil oprettet!",
          description: "Din mæglerprofil er nu oprettet og du er logget ind.",
        });
      } else {
        throw new Error('Login fejlede efter oprettelse');
      }
    } catch (error) {
      toast({
        title: "Fejl",
        description: "Der opstod en fejl ved oprettelse af profilen. Prøv igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navigation />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Opret Mæglerprofil
            </h1>
            <p className="text-gray-600">
              Tilmeld dig og få adgang til nye kunder på HouseHub
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-center">Registrer dig som mægler</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <PersonalInfoSection
                  formData={{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                  }}
                  errors={errors}
                  onInputChange={handleInputChange}
                />

                <ProfessionalInfoSection
                  formData={{
                    agency: formData.agency,
                    primaryRegion: formData.primaryRegion,
                    specialties: formData.specialties
                  }}
                  errors={errors}
                  onInputChange={handleInputChange}
                  onSpecialtyChange={handleSpecialtyChange}
                />

                <SecuritySection
                  formData={{
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                  }}
                  errors={errors}
                  onInputChange={handleInputChange}
                />

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => {
                      setAcceptedTerms(checked as boolean);
                      if (errors.terms) {
                        setErrors(prev => ({ ...prev, terms: '' }));
                      }
                    }}
                    className={errors.terms ? 'border-red-500' : ''}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    Jeg accepterer <a href="/vilkaar" className="text-blue-600 hover:underline">handelsbetingelserne</a> og <a href="/privatlivspolitik" className="text-blue-600 hover:underline">privatlivspolitikken</a>
                  </Label>
                </div>
                {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Opretter profil...' : 'Opret mæglerprofil'}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Har du allerede en profil?{' '}
                  <a href="/maegler/login" className="text-blue-600 hover:underline font-medium">
                    Log ind her
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AgentSignup;
