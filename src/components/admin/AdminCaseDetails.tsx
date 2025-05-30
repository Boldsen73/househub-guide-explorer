
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Home, MessageSquare, TrendingUp, Calendar, MapPin, Phone, Mail, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdminCaseDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: any;
}

const AdminCaseDetails: React.FC<AdminCaseDetailsProps> = ({
  open,
  onOpenChange,
  caseData
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(caseData || {});
  const [detailedCaseData, setDetailedCaseData] = useState<any>(null);
  const [realSellerData, setRealSellerData] = useState<any>(null);

  // Load detailed case data when dialog opens
  useEffect(() => {
    if (open && caseData?.id) {
      console.log('Loading detailed case data for case:', caseData.id);
      
      // Load the original seller case data
      const sellerCaseKey = `seller_case_${caseData.id}`;
      const sellerCaseData = localStorage.getItem(sellerCaseKey);
      
      if (sellerCaseData) {
        try {
          const parsedSellerCase = JSON.parse(sellerCaseData);
          console.log('Found detailed seller case data:', parsedSellerCase);
          setDetailedCaseData(parsedSellerCase);
          
          // If we have a sellerId, get the actual seller user data
          if (parsedSellerCase.sellerId) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const seller = users.find(u => u.id === parsedSellerCase.sellerId);
            if (seller) {
              console.log('Found seller user data:', seller);
              setRealSellerData(seller);
            }
          }
        } catch (error) {
          console.error('Error parsing seller case data:', error);
        }
      }
    }
  }, [open, caseData?.id]);

  // Update editData when we get new detailed data
  useEffect(() => {
    if (detailedCaseData && realSellerData) {
      setEditData({
        ...caseData,
        address: detailedCaseData.address || caseData.address,
        type: detailedCaseData.propertyType || caseData.type,
        size: detailedCaseData.size ? `${detailedCaseData.size} m²` : caseData.size,
        price: detailedCaseData.estimatedPrice || caseData.price,
        municipality: detailedCaseData.municipality || detailedCaseData.city || caseData.municipality,
        constructionYear: detailedCaseData.buildYear || caseData.constructionYear,
        description: detailedCaseData.notes || detailedCaseData.comments || caseData.description,
        energyLabel: detailedCaseData.energyLabel || caseData.energyLabel,
        rooms: detailedCaseData.rooms || caseData.rooms,
        seller: {
          name: realSellerData.name || 'Ukendt sælger',
          email: realSellerData.email || 'Ikke angivet',
          phone: realSellerData.phone || 'Ikke angivet',
          expectedTimeframe: detailedCaseData.sellerExpectedTimeframe || '3-6 måneder',
          priorities: detailedCaseData.sellerPriorities || ['Høj pris', 'Hurtig salg']
        },
        sellerName: realSellerData.name || 'Ukendt sælger',
        sellerEmail: realSellerData.email || 'Ikke angivet',
        sellerPhone: realSellerData.phone || 'Ikke angivet'
      });
    }
  }, [detailedCaseData, realSellerData, caseData]);

  if (!caseData) return null;

  const handleSave = () => {
    // Update the case data in localStorage
    if (caseData.id) {
      const caseKey = `seller_case_${caseData.id}`;
      const existingData = JSON.parse(localStorage.getItem(caseKey) || '{}');
      
      const updatedData = {
        ...existingData,
        address: editData.address,
        propertyType: editData.type,
        size: editData.size?.replace(' m²', ''),
        notes: editData.description,
        municipality: editData.municipality,
        estimatedPrice: editData.price,
        buildYear: editData.constructionYear
      };
      
      localStorage.setItem(caseKey, JSON.stringify(updatedData));
      
      // Also update seller information if available
      if (realSellerData && editData.seller) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const sellerIndex = users.findIndex(u => u.id === realSellerData.id);
        
        if (sellerIndex >= 0) {
          users[sellerIndex] = {
            ...users[sellerIndex],
            name: editData.seller.name,
            email: editData.seller.email,
            phone: editData.seller.phone
          };
          localStorage.setItem('users', JSON.stringify(users));
        }
      }
      
      // Trigger update events
      window.dispatchEvent(new CustomEvent('caseUpdated'));
      window.dispatchEvent(new Event('storage'));
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(caseData);
    setIsEditing(false);
  };

  // Use the detailed data for display
  const displayData = detailedCaseData ? {
    ...caseData,
    address: detailedCaseData.address || caseData.address,
    type: detailedCaseData.propertyType || caseData.type,
    size: detailedCaseData.size ? `${detailedCaseData.size} m²` : caseData.size,
    price: detailedCaseData.estimatedPrice || caseData.price,
    municipality: detailedCaseData.municipality || detailedCaseData.city || caseData.municipality,
    constructionYear: detailedCaseData.buildYear || caseData.constructionYear,
    description: detailedCaseData.notes || detailedCaseData.comments || caseData.description,
    energyLabel: detailedCaseData.energyLabel || caseData.energyLabel,
    rooms: detailedCaseData.rooms || caseData.rooms,
    seller: realSellerData ? {
      name: realSellerData.name || 'Ukendt sælger',
      email: realSellerData.email || 'Ikke angivet',
      phone: realSellerData.phone || 'Ikke angivet',
      expectedTimeframe: detailedCaseData.sellerExpectedTimeframe || '3-6 måneder',
      priorities: detailedCaseData.sellerPriorities || ['Høj pris', 'Hurtig salg']
    } : caseData.seller
  } : caseData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Sagdetaljer - {displayData.sagsnummer}
            </DialogTitle>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm">Gem</Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">Annuller</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Rediger
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Oversigt</TabsTrigger>
            <TabsTrigger value="seller">Sælger</TabsTrigger>
            <TabsTrigger value="offers">Tilbud ({displayData.offers?.length || 0})</TabsTrigger>
            <TabsTrigger value="messages">Beskeder ({displayData.messages?.length || 0})</TabsTrigger>
            <TabsTrigger value="activity">Aktivitet</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ejendom Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Adresse</Label>
                  {isEditing ? (
                    <Input 
                      value={editData.address || ''} 
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.address}</p>
                  )}
                </div>
                <div>
                  <Label>Type</Label>
                  {isEditing ? (
                    <Input 
                      value={editData.type || ''} 
                      onChange={(e) => setEditData({...editData, type: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.type}</p>
                  )}
                </div>
                <div>
                  <Label>Størrelse</Label>
                  {isEditing ? (
                    <Input 
                      value={editData.size || ''} 
                      onChange={(e) => setEditData({...editData, size: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.size}</p>
                  )}
                </div>
                <div>
                  <Label>Pris</Label>
                  {isEditing ? (
                    <Input 
                      value={editData.price || ''} 
                      onChange={(e) => setEditData({...editData, price: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.price}</p>
                  )}
                </div>
                <div>
                  <Label>Kommune</Label>
                  {isEditing ? (
                    <Input 
                      value={editData.municipality || ''} 
                      onChange={(e) => setEditData({...editData, municipality: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.municipality || 'Ikke angivet'}</p>
                  )}
                </div>
                <div>
                  <Label>Byggeår</Label>
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={editData.constructionYear || ''} 
                      onChange={(e) => setEditData({...editData, constructionYear: parseInt(e.target.value)})}
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.constructionYear}</p>
                  )}
                </div>
                <div>
                  <Label>Værelser</Label>
                  <p className="text-sm font-medium">{displayData.rooms || 'Ikke angivet'}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>
                    <Badge variant="outline">{displayData.status}</Badge>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label>Beskrivelse/Kommentarer</Label>
                  {isEditing ? (
                    <Textarea 
                      value={editData.description || ''} 
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm bg-blue-50 p-3 rounded-lg">{displayData.description || 'Ingen beskrivelse tilgængelig'}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seller" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sælger Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Navn</Label>
                  {isEditing ? (
                    <Input 
                      value={editData.seller?.name || editData.sellerName || ''} 
                      onChange={(e) => setEditData({
                        ...editData, 
                        seller: {...(editData.seller || {}), name: e.target.value},
                        sellerName: e.target.value
                      })}
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.seller?.name || displayData.sellerName || 'Ukendt sælger'}</p>
                  )}
                </div>
                <div>
                  <Label>Ønsket tidsramme</Label>
                  <p className="text-sm">{displayData.seller?.expectedTimeframe || '3-6 måneder'}</p>
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  {isEditing ? (
                    <Input 
                      type="email"
                      value={editData.seller?.email || editData.sellerEmail || ''} 
                      onChange={(e) => setEditData({
                        ...editData, 
                        seller: {...(editData.seller || {}), email: e.target.value},
                        sellerEmail: e.target.value
                      })}
                    />
                  ) : (
                    <p className="text-sm">{displayData.seller?.email || displayData.sellerEmail || 'Ikke angivet'}</p>
                  )}
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefon
                  </Label>
                  {isEditing ? (
                    <Input 
                      value={editData.seller?.phone || editData.sellerPhone || ''} 
                      onChange={(e) => setEditData({
                        ...editData, 
                        seller: {...(editData.seller || {}), phone: e.target.value},
                        sellerPhone: e.target.value
                      })}
                    />
                  ) : (
                    <p className="text-sm">{displayData.seller?.phone || displayData.sellerPhone || 'Ikke angivet'}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Prioriteter</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(displayData.seller?.priorities || ['Høj pris', 'Hurtig salg']).map((priority, index) => (
                      <Badge key={index} variant="secondary">{priority}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tilbud ({displayData.offers?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {displayData.offers && displayData.offers.length > 0 ? (
                  <div className="space-y-4">
                    {displayData.offers.map((offer, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label>Mægler</Label>
                            <p className="text-sm font-medium">{offer.agentName}</p>
                          </div>
                          <div>
                            <Label>Forventet pris</Label>
                            <p className="text-sm">{offer.expectedPrice}</p>
                          </div>
                          <div>
                            <Label>Salær</Label>
                            <p className="text-sm">{offer.commission}</p>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <Badge variant="outline">{offer.status}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Ingen tilbud endnu</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Beskeder ({displayData.messages?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {displayData.messages && displayData.messages.length > 0 ? (
                  <div className="space-y-4">
                    {displayData.messages.map((message, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{message.fromName}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(message.timestamp).toLocaleString('da-DK')}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Ingen beskeder endnu</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Aktivitetslog
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayData.timeline?.map((event, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">{event.event}</p>
                        <p className="text-sm text-gray-500">
                          {event.user} • {new Date(event.timestamp).toLocaleString('da-DK')}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="flex gap-4 items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">Sag oprettet</p>
                        <p className="text-sm text-gray-500">
                          {displayData.seller?.name || displayData.sellerName || 'Sælger'} • {new Date(displayData.createdAt || Date.now()).toLocaleString('da-DK')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCaseDetails;
