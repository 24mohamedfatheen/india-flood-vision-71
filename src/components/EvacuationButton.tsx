
import React from 'react';

const EvacuationButton: React.FC = () => {
  const handleEvacuate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          alert(`Your location: Latitude ${latitude}, Longitude ${longitude}`);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return <button onClick={handleEvacuate}>Evacuate</button>;
};

export default EvacuationButton;
