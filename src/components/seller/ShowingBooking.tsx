import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar as CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface ShowingBookingProps {
  onShowingBooked: (showingData: any) => void;
  initialDate?: Date; // New prop for initial date
  initialTime?: string; // New prop for initial time
}

const ShowingBooking: React.FC<ShowingBookingProps> = ({ onShowingBooked, initialDate, initialTime }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || '');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Effect to update state if initialDate or initialTime props change
  useEffect(() => {
    setSelectedDate(initialDate);
    setSelectedTime(initialTime || '');
  }, [initialDate, initialTime]);

  // Time slots from 10:00 to 18:00 (full hours only)
  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleBookShowing = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('=== BOOK SHOWING DEBUG ===');
    console.log('handleBookShowing called', { selectedDate, selectedTime, isSubmitting });

    if (!selectedDate || !selectedTime) {
      console.log('Missing date or time');
      toast({
        title: "Fejl",
        description: "Vælg venligst både dato og tidspunkt for fremvisningen.",
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) {
      console.log('Already submitting, ignoring click');
      return;
    }

    console.log('Starting booking process...');
    setIsSubmitting(true);

    try {
      const showingData = {
        date: selectedDate,
        time: selectedTime,
        notes: notes,
        status: 'planlagt',
        bookedAt: new Date().toISOString()
      };

      console.log('Booking showing with data:', showingData);

      // Store the showing data in localStorage with multiple keys for robustness
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      console.log('Current user for booking:', currentUser);

      if (currentUser.id) {
        const storageKey = `showing_data_${currentUser.id}`;
        localStorage.setItem(storageKey, JSON.stringify(showingData));
        console.log('Stored showing data with key:', storageKey);

        // Also store in a general showing key
        localStorage.setItem('current_showing_data', JSON.stringify(showingData));
        console.log('Stored in current_showing_data as backup');

        // Store for agent visibility - sync to agent system with enhanced data
        const agentShowingData = {
          sellerId: currentUser.id,
          sellerName: currentUser.firstName + ' ' + currentUser.lastName,
          sellerEmail: currentUser.email,
          showingDate: selectedDate,
          showingTime: selectedTime,
          showingNotes: notes,
          status: 'showing_booked',
          bookedAt: new Date().toISOString()
        };

        // Store in agent-accessible format
        localStorage.setItem(`agent_showing_${currentUser.id}`, JSON.stringify(agentShowingData));
        localStorage.setItem(`case_${currentUser.id}_showing`, JSON.stringify(agentShowingData));

        // Update all cases for this seller with showing info and ensure complete data sync
        const existingCases = JSON.parse(localStorage.getItem('cases') || '[]');
        const updatedCases = existingCases.map((case_: any) => {
          if (case_.sellerId === currentUser.id) {
            return {
              ...case_,
              showingDate: selectedDate,
              showingTime: selectedTime,
              showingNotes: notes,
              status: 'showing_booked'
            };
          }
          return case_;
        });

        localStorage.setItem('cases', JSON.stringify(updatedCases));
        console.log('Updated cases with showing data');

        // Also update individual seller case data to include complete seller information
        const sellerCaseKey = `seller_case_${currentUser.id}`;
        const existingSellerCase = JSON.parse(localStorage.getItem(sellerCaseKey) || '{}');
        const enhancedSellerCase = {
          ...existingSellerCase,
          showingDate: selectedDate,
          showingTime: selectedTime,
          showingNotes: notes,
          status: 'showing_booked',
          // Ensure all seller data is preserved
          sellerId: currentUser.id,
          sellerName: currentUser.firstName + ' ' + currentUser.lastName,
          sellerEmail: currentUser.email,
          sellerPhone: currentUser.phone || 'Ikke angivet'
        };
        localStorage.setItem(sellerCaseKey, JSON.stringify(enhancedSellerCase));

        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('showingBooked', {
          detail: {
            caseId: currentUser.id,
            showingData: agentShowingData
          }
        }));

      } else {
        console.error('No user ID found for storing showing data');
      }

      // Call the callback function
      console.log('Calling onShowingBooked callback...');
      await onShowingBooked(showingData);

      toast({
        title: "Fremvisning booket",
        description: `Fremvisning er planlagt til ${format(selectedDate, 'EEEE d. MMMM yyyy', { locale: da })} kl. ${selectedTime}. Du vender nu tilbage til dit sagsoversigt.`,
      });

      console.log('Showing booked successfully');
      
      // Force navigation back to seller my-case page to show updated status
      setTimeout(() => {
        window.location.href = '/seller/my-case';
      }, 1500);

      // Dispatch events for real-time updates to admin dashboard
      window.dispatchEvent(new CustomEvent('showingBooked', { detail: showingData }));
      window.dispatchEvent(new CustomEvent('caseUpdated', { detail: showingData }));
      window.dispatchEvent(new Event('storage'));

      // Reset form if it's a new booking, not just editing
      if (!initialDate && !initialTime) {
        setSelectedDate(undefined);
        setSelectedTime('');
        setNotes('');
      }

    } catch (error) {
      console.error('Error booking showing:', error);
      toast({
        title: "Fejl",
        description: "Der opstod en fejl ved booking af fremvisningen. Prøv igen.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      console.log('Booking process completed');
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Minimum 7 days from today
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 7);

    // Check if date is before minimum date
    if (date < minDate) {
      return true;
    }

    // Check if date is weekend (Saturday = 6, Sunday = 0)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return true;
    }

    return false;
  };

  const canBookShowing = selectedDate && selectedTime && !isSubmitting;

  console.log('ShowingBooking render state:', { selectedDate, selectedTime, canBookShowing, isSubmitting });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Book fremvisning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Information about showing duration */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Om fremvisningen</h4>
              <p className="text-sm text-blue-800">
                Fremvisningen vil typisk tage ca. 2 timer, hvor mæglerne får mulighed for at se boligen og stille spørgsmål.
                Du kan forvente at møde flere mæglere, der alle er interesserede i at hjælpe dig med salget.
              </p>
              <p className="text-sm text-blue-800 mt-2">
                <strong>Vigtigt:</strong> Datoen skal være mindst 7 dage frem, så mæglerne har tid til at planlægge.
              </p>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Vælg dato (minimum 7 dage frem, ikke weekender)</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={isDateDisabled}
            locale={da}
            className="rounded-md border"
          />
        </div>

        {selectedDate && (
          <div>
            <Label className="text-base font-medium mb-3 block">Vælg tidspunkt (10:00 - 18:00)</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime} disabled={isSubmitting}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vælg tidspunkt for fremvisningen">
                  {selectedTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {selectedTime}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="showing-notes">Noter til mæglere (valgfrit)</Label>
          <Textarea
            id="showing-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Særlige ønsker eller bemærkninger til fremvisningen..."
            className="mt-2"
            disabled={isSubmitting}
          />
        </div>

        {selectedDate && selectedTime && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Fremvisning planlagt til:</h4>
            <p className="text-sm text-green-800">
              <strong>Dato:</strong> {format(selectedDate, 'EEEE d. MMMM yyyy', { locale: da })}
            </p>
            <p className="text-sm text-green-800">
              <strong>Tidspunkt:</strong> {selectedTime}
            </p>
            <p className="text-sm text-green-800 mt-2">
              <strong>Forventet varighed:</strong> Ca. 2 timer
            </p>
            {notes && (
              <p className="text-sm text-green-800 mt-2">
                <strong>Noter:</strong> {notes}
              </p>
            )}
          </div>
        )}

        <Button
          onClick={handleBookShowing}
          disabled={!canBookShowing}
          className="w-full"
          type="button"
        >
          {isSubmitting ? 'Booker fremvisning...' : 'Book fremvisning'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShowingBooking;