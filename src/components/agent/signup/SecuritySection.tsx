
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award } from 'lucide-react';

interface SecuritySectionProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Award className="h-5 w-5" />
        Adgangskode
      </h3>
      
      <div>
        <Label htmlFor="password">Adgangskode</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onInputChange('password', e.target.value)}
          className={errors.password ? 'border-red-500' : ''}
          placeholder="Mindst 8 tegn"
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Bekræft adgangskode</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => onInputChange('confirmPassword', e.target.value)}
          className={errors.confirmPassword ? 'border-red-500' : ''}
          placeholder="Gentag adgangskode"
        />
        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
      </div>
    </div>
  );
};

export default SecuritySection;
