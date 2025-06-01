
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

export const formatPrice = (price: string): string => {
  if (!price || price === 'Ikke angivet') return 'Ikke angivet';
  return price.replace(/(\d)\.(\d{3})\.(\d{3})/, '$1.$2.$3');
};

export const getViewingText = (caseId: number): string => {
  // Check for showing data in multiple formats
  const showingData1 = localStorage.getItem(`case_${caseId}_showing`);
  const showingData2 = localStorage.getItem(`showing_data_${caseId}`);
  
  let showingInfo = null;
  
  if (showingData1) {
    try {
      const parsed = JSON.parse(showingData1);
      if (parsed.showingDate && parsed.showingTime) {
        showingInfo = {
          date: new Date(parsed.showingDate),
          time: parsed.showingTime
        };
      }
    } catch (error) {
      console.error('Error parsing showing data 1:', error);
    }
  }
  
  if (!showingInfo && showingData2) {
    try {
      const parsed = JSON.parse(showingData2);
      if (parsed.date && parsed.time) {
        showingInfo = {
          date: new Date(parsed.date),
          time: parsed.time
        };
      }
    } catch (error) {
      console.error('Error parsing showing data 2:', error);
    }
  }
  
  if (showingInfo && showingInfo.date && showingInfo.time) {
    try {
      const formattedDate = format(showingInfo.date, 'EEEE d. MMMM', { locale: da });
      return `Fremvisning: ${formattedDate} kl. ${showingInfo.time}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fremvisning planlagt';
    }
  }
  
  return 'Fremvisning ikke planlagt endnu';
};

export const checkForNewMessages = (agentStatus: string): boolean => {
  // Mock function - in real app this would check message timestamps
  return agentStatus === 'offer_submitted';
};
