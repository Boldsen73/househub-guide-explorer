
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye } from 'lucide-react';
import { Case } from '@/utils/userData';

interface AdminCasesListProps {
  cases: Case[];
  onStatusChange: (caseId: string, newStatus: Case['status']) => void;
  onViewCase: (caseData: Case) => void;
}

const AdminCasesList = ({ cases, onStatusChange, onViewCase }: AdminCasesListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusText = (status: string) => {
    const statusMap = {
      'draft': 'kladde',
      'active': 'aktiv',
      'showing_booked': 'fremvisning booket',
      'showing_completed': 'fremvisning afsluttet',
      'offers_received': 'tilbud modtaget',
      'realtor_selected': 'mægler valgt',
      'archived': 'arkiveret',
      'withdrawn': 'trukket tilbage'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      'draft': 'bg-gray-100 text-gray-800',
      'active': 'bg-blue-100 text-blue-800',
      'showing_booked': 'bg-yellow-100 text-yellow-800',
      'showing_completed': 'bg-orange-100 text-orange-800',
      'offers_received': 'bg-purple-100 text-purple-800',
      'realtor_selected': 'bg-green-100 text-green-800',
      'archived': 'bg-gray-100 text-gray-600',
      'withdrawn': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = searchTerm === '' || 
      case_.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (case_.sagsnummer && case_.sagsnummer.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Søg i sager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer efter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle statuser</SelectItem>
            <SelectItem value="active">Aktiv</SelectItem>
            <SelectItem value="showing_booked">Fremvisning booket</SelectItem>
            <SelectItem value="showing_completed">Fremvisning afsluttet</SelectItem>
            <SelectItem value="offers_received">Tilbud modtaget</SelectItem>
            <SelectItem value="realtor_selected">Mægler valgt</SelectItem>
            <SelectItem value="archived">Arkiveret</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredCases.map((case_) => (
          <Card key={case_.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{case_.sagsnummer}</h3>
                    <Badge className={getStatusColor(case_.status)}>
                      {getStatusText(case_.status)}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-1">{case_.address}</p>
                  <p className="text-sm text-gray-500">
                    {case_.type} • {case_.size} m² • {case_.price}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Sælger: {case_.sellerName || 'Ukendt'}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewCase(case_)}
                    title="Se sagdetaljer"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Se detaljer
                  </Button>
                  
                  {case_.status === 'showing_completed' && (
                    <Button
                      size="sm"
                      onClick={() => onStatusChange(case_.id.toString(), 'offers_received')}
                    >
                      Gør tilbud tilgængelige
                    </Button>
                  )}
                  
                  {case_.status === 'offers_received' && (
                    <Button
                      size="sm"
                      onClick={() => onStatusChange(case_.id.toString(), 'realtor_selected')}
                    >
                      Marker som valgt
                    </Button>
                  )}
                  
                  {!['archived', 'withdrawn'].includes(case_.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onStatusChange(case_.id.toString(), 'archived')}
                    >
                      Arkiver
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredCases.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Ingen sager fundet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminCasesList;
