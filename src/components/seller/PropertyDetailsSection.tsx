
import React from 'react';

interface PropertyDetailsProps {
  formData: {
    boligtype: string;
    størrelse: string;
    byggeår: string;
    værelser: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const PropertyDetailsSection: React.FC<PropertyDetailsProps> = ({ formData, setFormData }) => {
  const currentYear = new Date().getFullYear();

  const formatNumberWithThousandSeparator = (value: string) => {
    const onlyNums = value.replace(/\D/g, '');
    return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberWithThousandSeparator(e.target.value);
    setFormData((prev: any) => ({ ...prev, størrelse: formatted }));
  };

  const handleBuildYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val && parseInt(val) > currentYear) val = currentYear.toString();

    setFormData((prev: any) => ({ ...prev, byggeår: val }));
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Boligdetaljer</h2>

      {/* Boligtype dropdown */}
      <label htmlFor="boligtype" className="block mb-1">
        Boligtype
      </label>
      <select
        id="boligtype"
        name="boligtype"
        value={formData.boligtype}
        onChange={(e) =>
          setFormData((prev: any) => ({ ...prev, boligtype: e.target.value }))
        }
        className="border p-2 rounded mb-4 w-full"
      >
        <option value="">-- Vælg boligtype (valgfrit) --</option>
        <option value="Villa">Villa</option>
        <option value="Rækkehus">Rækkehus</option>
        <option value="Lejlighed">Lejlighed</option>
        <option value="Andet">Andet</option>
      </select>

      {/* Størrelse m² */}
      <label htmlFor="stoerrelse" className="block mb-1">
        Størrelse (m²)
      </label>
      <input
        type="text"
        id="stoerrelse"
        name="størrelse"
        placeholder="F.eks. 130"
        value={formData.størrelse}
        onChange={handleSizeChange}
        className="border p-2 rounded mb-4 w-full"
      />

      {/* Byggeår */}
      <label htmlFor="byggeår" className="block mb-1">
        Byggeår
      </label>
      <input
        type="text"
        id="byggeår"
        name="byggeår"
        placeholder="F.eks. 1990"
        value={formData.byggeår}
        onChange={handleBuildYearChange}
        maxLength={4}
        className="border p-2 rounded mb-4 w-full"
      />

      {/* Antal værelser */}
      <label htmlFor="vaerelser" className="block mb-1">
        Antal værelser
      </label>
      <input
        type="number"
        id="vaerelser"
        name="værelser"
        min={1}
        placeholder="Antal værelser"
        value={formData.værelser}
        onChange={(e) =>
          setFormData((prev: any) => ({ ...prev, værelser: e.target.value }))
        }
        className="border p-2 rounded mb-4 w-full"
      />
    </section>
  );
};

export default PropertyDetailsSection;
