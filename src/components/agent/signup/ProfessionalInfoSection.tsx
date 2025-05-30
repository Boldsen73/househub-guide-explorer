
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building } from 'lucide-react';

interface ProfessionalInfoSectionProps {
  formData: {
    agency: string;
    primaryRegion: string;
    specialties: string[];
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onSpecialtyChange: (specialty: string, checked: boolean) => void;
}

const regions = [
  'København',
  'Frederiksberg',
  'Nordsjælland',
  'Vestsjælland',
  'Østsjælland',
  'Bornholm',
  'Fyn',
  'Sydjylland',
  'Østjylland',
  'Vestjylland',
  'Nordjylland'
];

const propertyTypes = [
  'Villa',
  'Rækkehus',
  'Lejlighed',
  'Sommerhus',
  'Erhverv',
  'Grund'
];

const ProfessionalInfoSection: React.FC<ProfessionalInfoSectionProps> = ({
  formData,
  errors,
  onInputChange,
  onSpecialtyChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Building className="h-5 w-5" />
        Professionelle oplysninger
      </h3>
      
      <div>
        <Label htmlFor="agency">
          Mæglervirksomhed <span className="text-red-500">*</span>
        </Label>
        <Input
          id="agency"
          type="text"
          value={formData.agency}
          onChange={(e) => onInputChange('agency', e.target.value)}
          className={errors.agency ? 'border-red-500' : ''}
          placeholder="Navn på mæglervirksomhed"
        />
        {errors.agency && <p className="text-sm text-red-500 mt-1">{errors.agency}</p>}
      </div>

      <div>
        <Label htmlFor="primaryRegion">
          Primær region <span className="text-red-500">*</span>
        </Label>
        <Select value={formData.primaryRegion} onValueChange={(value) => onInputChange('primaryRegion', value)}>
          <SelectTrigger className={errors.primaryRegion ? 'border-red-500' : ''}>
            <SelectValue placeholder="Vælg din primære region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.primaryRegion && <p className="text-sm text-red-500 mt-1">{errors.primaryRegion}</p>}
      </div>

      <div>
        <Label>Specialer (vælg alle relevante)</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {propertyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={formData.specialties.includes(type)}
                onCheckedChange={(checked) => onSpecialtyChange(type, checked as boolean)}
              />
              <Label htmlFor={type} className="text-sm">{type}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoSection;
