import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { Case } from '@/types/user';
import UserManagement from '@/components/admin/UserManagement';
import AdminCaseDetails from '@/components/admin/AdminCaseDetails';
import AdminDashboardOverview from '@/components/admin/AdminDashboardOverview';
import AdminCasesList from '@/components/admin/AdminCasesList';
import AdminNavigationTabs from '@/components/admin/AdminNavigationTabs';
import { useAdminData } from '@/hooks/useAdminData';

const AdminDashboard = () => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const { cases, users, loadData, handleStatusChange } = useAdminData();
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'users' | 'archive'>('overview');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showCaseDetails, setShowCaseDetails] = useState(false);

  const handleViewCase = (caseData: Case) => {
    console.log('Viewing case details:', caseData);
    
    // Create detailed case data for the modal
    const detailedCase = {
      id: parseInt(caseData.id.toString()),
      sagsnummer: caseData.sagsnummer,
      address: caseData.address,
      type: caseData.type,
      size: `${caseData.size} m²`,
      rooms: 4, // Default value
      price: caseData.price,
      priceValue: caseData.priceValue,
      status: getStatusText(caseData.status),
      seller: {
        name: caseData.sellerName || 'Ukendt sælger',
        email: caseData.sellerEmail || 'Ikke angivet',
        phone: caseData.sellerPhone || 'Ikke angivet',
        expectedTimeframe: '3-6 måneder',
        priorities: ['Høj pris', 'Hurtig salg']
      },
      offers: [],
      messages: [],
      timeline: [
        {
          id: 1,
          event: 'Sag oprettet',
          timestamp: caseData.createdAt,
          user: caseData.sellerName || 'Sælger',
          type: 'created'
        }
      ]
    };
    
    setSelectedCase(detailedCase);
    setShowCaseDetails(true);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logget ud",
      description: "Du er nu logget ud af admin panelet",
    });
  };

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

  const onStatusChange = (caseId: string, newStatus: Case['status']) => {
    handleStatusChange(caseId, newStatus);
    toast({
      title: "Sagsstatus opdateret",
      description: `Sagen er nu ${getStatusText(newStatus)}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Administrator Dashboard</h1>
            <p className="text-gray-600">Administrer sager, brugere og systemindstillinger</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Log ud
          </Button>
        </div>

        <AdminNavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <AdminDashboardOverview cases={cases} users={users} />
        )}
        {activeTab === 'cases' && (
          <AdminCasesList 
            cases={cases} 
            onStatusChange={onStatusChange}
            onViewCase={handleViewCase}
          />
        )}
        {activeTab === 'users' && (
          <UserManagement users={users} onUsersUpdated={loadData} />
        )}
        {activeTab === 'archive' && (
          <AdminCasesList 
            cases={cases} 
            onStatusChange={onStatusChange}
            onViewCase={handleViewCase}
          />
        )}
      </div>

      {/* Case Details Modal */}
      <AdminCaseDetails
        open={showCaseDetails}
        onOpenChange={setShowCaseDetails}
        caseData={selectedCase}
      />
    </div>
  );
};

export default AdminDashboard;
