import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, UserMinus, Trash2, Lock, Unlock, Mail, MapPin, Phone, Building2 } from 'lucide-react';
import {
  TestUser as User,
  deactivateTestUser,
  deleteTestUser,
  updateTestUser
} from '@/utils/testData';
import { useToast } from '@/hooks/use-toast';
import EditUserDialog from './EditUserDialog';

interface UserManagementProps {
  users: User[];
  onUsersUpdated: () => void;
}

const UserManagement = ({ users, onUsersUpdated }: UserManagementProps) => {
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const sellers = users.filter(u => u.role === 'seller');
  const agents = users.filter(u => u.role === 'agent');

  const handleDeactivateUser = (user: User) => {
    setDeactivatingUser(user);
  };

  const confirmDeactivation = () => {
    if (deactivatingUser) {
      try {
        deactivateTestUser(deactivatingUser.id);
        toast({
          title: "Bruger deaktiveret",
          description: `${deactivatingUser.name} er blevet deaktiveret.`,
        });
        onUsersUpdated();
        setDeactivatingUser(null);
      } catch (error) {
        toast({
          title: "Fejl",
          description: "Der opstod en fejl ved deaktivering af brugeren.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
  };

  const confirmDeletion = () => {
    if (deletingUser) {
      try {
        deleteTestUser(deletingUser.id);
        toast({
          title: "Bruger slettet",
          description: `${deletingUser.name} og tilhørende data er blevet permanent fjernet.`,
        });
        onUsersUpdated();
        setDeletingUser(null);
      } catch (error) {
        toast({
          title: "Fejl",
          description: "Der opstod en fejl ved sletning af brugeren.",
          variant: "destructive",
        });
      }
    }
  };

  const reactivateUser = (user: User) => {
    try {
      updateTestUser(user.id, { isActive: true });
      toast({
        title: "Bruger genaktiveret",
        description: `${user.name} er nu aktiv igen.`,
      });
      onUsersUpdated();
    } catch (error) {
      toast({
        title: "Fejl",
        description: "Kunne ikke genaktivere brugeren.",
        variant: "destructive",
      });
    }
  };

  const renderUserCard = (user: User) => (
    <div
      key={user.id}
      className={`flex items-center justify-between p-4 border rounded-lg ${user.isActive === false ? 'opacity-60' : ''}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-lg">{user.name}</p>
          {user.isActive === false && (
            <>
              <Badge variant="destructive">Deaktiveret</Badge>
              <Lock className="h-4 w-4 text-gray-500" />
            </>
          )}
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {user.email}</p>
          {user.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {user.phone}</p>}
          {user.address && <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {user.address}</p>}
          {user.company && <p className="flex items-center gap-2"><Building2 className="h-4 w-4" /> {user.company}</p>}
          {user.primaryRegion && <p className="text-xs">Primært område: {user.primaryRegion}</p>}
          {user.specialties && user.specialties.length > 0 && (
            <p className="text-xs">Specialer: {user.specialties.join(', ')}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 ml-4">
        <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
          <Edit className="h-4 w-4 mr-1" />
          Rediger
        </Button>

        {user.isActive !== false ? (
          <Button size="sm" variant="outline" onClick={() => handleDeactivateUser(user)}>
            <UserMinus className="h-4 w-4 mr-1" />
            Deaktiver
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => reactivateUser(user)}>
            <Unlock className="h-4 w-4 mr-1" />
            Genaktivér
          </Button>
        )}

        <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Slet
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sælgere ({sellers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sellers.length === 0 ? (
            <p className="text-gray-500">Ingen sælgere endnu</p>
          ) : (
            <div className="space-y-3">{sellers.map(renderUserCard)}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mæglere ({agents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <p className="text-gray-500">Ingen mæglere endnu</p>
          ) : (
            <div className="space-y-3">{agents.map(renderUserCard)}</div>
          )}
        </CardContent>
      </Card>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={onUsersUpdated}
        />
      )}

      {/* Deactivation Confirmation */}
      <AlertDialog open={!!deactivatingUser} onOpenChange={() => setDeactivatingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bekræft deaktivering</AlertDialogTitle>
            <AlertDialogDescription>
              Du er ved at deaktivere en bruger. Er du sikker?
              <br />
              Brugeren vil ikke længere kunne logge ind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuller</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeactivation}>
              Deaktiver bruger
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deletion Confirmation */}
      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bekræft sletning</AlertDialogTitle>
            <AlertDialogDescription>
              Denne handling vil permanent fjerne brugeren og tilhørende sager. Er du sikker?
              <br />
              <strong>Dette kan ikke fortrydes.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuller</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletion} className="bg-red-600 hover:bg-red-700">
              Slet permanent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
