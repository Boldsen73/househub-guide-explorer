import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Home, DollarSign, Calendar } from 'lucide-react';
import AdminReturnBanner from '@/components/admin/AdminReturnBanner';
import { useAgentCases } from '@/hooks/useAgentCases';
import CaseActions from '@/components/agent/caseDetails/CaseActions'; // ✅ Husk at importere

const AgentCaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdminSession = localStorage.getItem('admin_session_backup');
  const { cases } = useAgentCases();

  const caseData = cases.find(c => c.id === parseInt(id || '0'));

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {isAdminSession && <AdminReturnBanner />}
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/maegler/gennemse-sager">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tilbage til sager
              </Button>
            </Link>
            <p className="text-gray-600">Sag ikke fundet</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitOffer = () => {
    navigate(`/maegler/afgiv-tilbud/${id}`);
  };

  const handleContactSeller = () => {
    navigate(`/maegler/beskeder?case=${id}`);
  };

  const handleBookViewing = () => {
    navigate(`/maegler/book-fremvisning/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAdminSession && <AdminReturnBanner />}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/maegler/gennemse-sager">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tilbage til sager
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sag detaljer</h1>
            <p className="text-gray-600">SAG-2024-{id?.padStart(3, '0')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sag oversigt</span>
                  <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{caseData.address}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium">{caseData.type}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Størrelse</p>
                    <p className="font-medium">{caseData.size}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Værelser</p>
                    <p className="font-medium">{caseData.rooms}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Pris</p>
                      <p className="font-medium text-green-600">{caseData.price}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Beskrivelse</p>
                  <p className="text-gray-800">{caseData.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* ✅ Fix: Brug CaseActions med caseId som string */}
            <Card>
              <CardHeader>
                <CardTitle>Handlinger</CardTitle>
              </CardHeader>
              <CardContent>
                <CaseActions 
                  agentStatus="active"
                  caseId={String(caseData.id)} // ✅ fixet her
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sælger information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Navn</p>
                  <p className="font-medium">{caseData.sellerName || 'Ikke angivet'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{caseData.sellerEmail || 'Ikke angivet'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefon</p>
                  <p className="font-medium">{caseData.sellerPhone || 'Ikke angivet'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sag tidslinje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Sag oprettet</p>
                      <p className="text-xs text-gray-600">
                        {new Date().toLocaleDateString('da-DK')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Publiceret til mæglere</p>
                      <p className="text-xs text-gray-600">
                        {new Date().toLocaleDateString('da-DK')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCaseDetail;
