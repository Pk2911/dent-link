import React, { createContext, useContext, useState, useEffect } from 'react';

interface Slot {
  id: number;
  time: string;
  is_booked: boolean;
}

interface BookingContextType {
  slots: Slot[];
  bookSlot: (id: number) => Promise<void>;
  refreshSlots: () => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

// Get API URL from env (for Vercel) or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [slots, setSlots] = useState<Slot[]>([]);

  const fetchSlots = () => {
    fetch(`${API_URL}/api/slots`)
      .then(res => res.json())
      .then(data => setSlots(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const bookSlot = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: id })
      });
      const data = await res.json();
      alert(data.message);
      fetchSlots(); // Refresh UI
    } catch (error) {
      alert("Error booking slot");
    }
  };

  return (
    <BookingContext.Provider value={{ slots, bookSlot, refreshSlots: fetchSlots }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
};