
import React from 'react';

interface Case {
  propertyType?: string;
  type: string;
  size: string;
  rooms?: string;
  buildYear: number;
}

interface CaseBasicInfoProps {
  case_: Case;
}

const CaseBasicInfo: React.FC<CaseBasicInfoProps> = ({ case_ }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-sm text-gray-600">Type</div>
        <div className="font-medium">{case_.propertyType || case_.type}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-600">Størrelse</div>
        <div className="font-medium">{case_.size}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-600">Værelser</div>
        <div className="font-medium">{case_.rooms || 'Ikke angivet'}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-600">Byggeår</div>
        <div className="font-medium">{case_.buildYear}</div>
      </div>
    </div>
  );
};

export default CaseBasicInfo;
