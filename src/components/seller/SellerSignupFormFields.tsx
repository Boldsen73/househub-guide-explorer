import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  pattern?: string;
  inputMode?: "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  readOnly?: boolean;
  minLength?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  type = "text",
  placeholder,
  maxLength,
  pattern,
  inputMode,
  readOnly = false,
  minLength
}) => (
  <div className="mb-4">
    <Label htmlFor={id}>
      {label} {required && <span className="text-red-600">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      maxLength={maxLength}
      pattern={pattern}
      inputMode={inputMode}
      readOnly={readOnly}
      minLength={minLength}
    />
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);

interface PostalCodeCityFieldsProps {
  postalCode: string;
  city: string;
  onPostalCodeChange: (value: string) => void;
  onCityChange: (value: string) => void;
  postalCodeError?: string;
  cityError?: string;
}

export const PostalCodeCityFields: React.FC<PostalCodeCityFieldsProps> = ({
  postalCode,
  city,
  onPostalCodeChange,
  onCityChange,
  postalCodeError,
  cityError
}) => (
  <div className="mb-4 flex gap-2">
    <div className="flex-1">
      <Label htmlFor="postalCode">Postnummer <span className="text-red-600">*</span></Label>
      <Input
        id="postalCode"
        type="text"
        value={postalCode}
        onChange={e => onPostalCodeChange(e.target.value)}
        required
        maxLength={4}
        pattern="\d*"
        inputMode="numeric"
      />
      {postalCodeError && <span className="text-red-500 text-sm">{postalCodeError}</span>}
    </div>
    <div className="flex-1">
      <Label htmlFor="city">By <span className="text-red-600">*</span></Label>
      <Input
        id="city"
        type="text"
        value={city}
        onChange={e => onCityChange(e.target.value)}
        required
        readOnly
      />
      {cityError && <span className="text-red-500 text-sm">{cityError}</span>}
    </div>
  </div>
);

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onChange,
  error
}) => (
  <div className="mb-6 flex items-center space-x-2">
    <Checkbox
      id="acceptTerms"
      checked={checked}
      onCheckedChange={checked => onChange(!!checked)}
    />
    <Label htmlFor="acceptTerms" className="select-none">
      Jeg accepterer{' '}
      <Link to="/vilkaar" className="text-blue-600 underline">
        handelsbetingelserne
      </Link>{' '}
      og{' '}
      <Link to="/privatlivspolitik" className="text-blue-600 underline">
        privatlivspolitikken
      </Link>{' '}
      <span className="text-red-600">*</span>
    </Label>
    {error && <span className="text-red-500 text-sm block">{error}</span>}
  </div>
);