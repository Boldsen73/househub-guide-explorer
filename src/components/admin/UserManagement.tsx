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
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Edit,
  UserMinus,
  Trash2,
  Lock,
  Unlock,
  Mail,
  MapPin,
  Phone,
  Building2
} from 'lucide-react';
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
          description: `${deactivatingUser.name} er blevet deaktiveret.`
        });
        onUsersUpdated();
        setDeactivatingUser(null);
      } catch (error) {
        toast({
          title: "Fejl",
          description: "Der opstod en fejl ved deaktivering af brugeren.",
          variant: "destructive"
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
          description: `${deletingUser.name} og tilhørende data er blevet permanent fjernet.`
        });
        onUsersUpdated();
        setDeletingUser(null);
      } catch (error) {
        toast({
          title: "Fejl",
          description: "Der opstod en fejl ved sletning af brugeren.",
          variant: "destructive"
        });
      }
    }
  };

  const reactivateUser = (user: User) => {
    try {
      updateTestUser(user.id, { isActive: true });
      toast({
        title: "Bruger genaktiveret",
        description: `${user.name} er nu aktiv igen.`
      });
      onUsersUpdated();
    } catch (error) {
      toast({
        title: "Fejl",
        description: "Kunne ikke genaktivere brugeren.",
        variant: "destructive"
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
          {user.postnummer && user.city && (
            <p className="text-sm text-gray-500">{user.postnummer} {user.city}</p>
          )}
          {user.company && <p className="flex items-center gap-2"><Building2 className="h-4 w-4" /> {user.company}</p>}
          {user.primaryRegion && <p className="text-xs">Primært område: {user.primaryRegion}</p>}
          {user.specialties && user.specialties.length > 0 && (
            <p className="text-xs">Specialer: {user.specialties.join(', ')}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2
