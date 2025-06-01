
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, XCircle } from 'lucide-react';

interface ShowingStatusCardProps {
  bookedShowingDetails: any;
  showingCompleted: boolean;
  onChangeShowing: () => void;
  onCancelShowing: () => void;
}

const ShowingStatusCard: React.FC<ShowingStatusCardProps> = ({
  bookedShowingDetails,
  showingCompleted,
  onChangeShowing,
  onCancelShowing
}) => {
  if (!bookedShowingDetails) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Fremvisning
          {showingCompleted && <Badge className="bg-green-100 text-green-700 ml-2">Afholdt</Badge>}
          {!showingCompleted && <Badge className="bg-blue-100 text-blue-700 ml-2">Planlagt</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-lg font-semibold text-gray-800">
            <Calendar className="h-6 w-6 text-purple-600" />
            <span>{bookedShowingDetails.date}</span>
            <Clock className="h-6 w-6 text-purple-600 ml-4" />
            <span>kl. {bookedShowingDetails.time}</span>
          </div>
          {bookedShowingDetails.notes && (
            <p className="text-sm text-gray-600 mt-2">Noter: {bookedShowingDetails.notes}</p>
          )}
          <p className="text-gray-600">
            Din fremvisning er blevet booket. Mæglere kan nu tilmelde sig.
          </p>
          {!showingCompleted && (
            <p className="text-sm text-gray-500">
              Når fremvisningen er afholdt, skal du markere den som afholdt for at mæglerne kan afgive tilbud.
            </p>
          )}
          <div className="flex space-x-2 mt-4">
            {!showingCompleted && (
              <>
                <Button variant="outline" onClick={onChangeShowing} className="flex-1">
                  <Edit className="h-4 w-4 mr-2" /> Ændr tidspunkt
                </Button>
                <Button variant="destructive" onClick={onCancelShowing} className="flex-1">
                  <XCircle className="h-4 w-4 mr-2" /> Annuller fremvisning
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowingStatusCard;
