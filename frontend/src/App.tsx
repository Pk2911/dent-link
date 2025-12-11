import { BookingProvider, useBooking } from './BookingContext';
import './App.css';

const BookingList = () => {
  const { slots, bookSlot, refreshSlots } = useBooking();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dr. House - Available Slots</h1>
      <button onClick={refreshSlots}>Refresh</button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '20px' }}>
        {slots.map(slot => (
          <div key={slot.id} style={{
            border: '1px solid #ccc',
            padding: '20px',
            backgroundColor: slot.is_booked ? '#ffcccc' : '#ccffcc',
            textAlign: 'center'
          }}>
            <h3>{slot.time}</h3>
            {slot.is_booked ? (
              <span style={{ color: 'red', fontWeight: 'bold' }}>BOOKED</span>
            ) : (
              <button onClick={() => bookSlot(slot.id)}>Book Now</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <BookingProvider>
      <BookingList />
    </BookingProvider>
  );
}

export default App;