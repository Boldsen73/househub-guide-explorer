
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';

interface PersonalInfoSectionProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <UserPlus className="h-5 w-5" />
        Personlige oplysninger
      </h3>
      
      <div>
        <Label htmlFor="name">
          Fulde navn <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          className={errors.name ? 'border-red-500' : ''}
          placeholder="Indtast dit fulde navn"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="email">
          Email adresse <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          className={errors.email ? 'border-red-500' : ''}
          placeholder="din@email.dk"
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="phone">
          Telefonnummer <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => onInputChange('phone', e.target.value)}
          className={errors.phone ? 'border-red-500' : ''}
          placeholder="12 34 56 78"
        />
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
      </div>
    </div>
  );
};

export default PersonalInfoSection;
