import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import HALO from 'vanta/dist/vanta.halo.min';

const VantaHaloBackground = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    // Initialize the Vanta effect only if it hasn't been initialized yet
    if (!vantaEffect) {
      setVantaEffect(
        HALO({
          el: vantaRef.current,
          THREE: THREE, // Pass the imported THREE object
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          // You can customize colors and settings here based on the Vanta website
          backgroundColor: 0x131a43, 
          baseColor: 0x111111,
          size: 1.5,
        })
      );
    }
    
    // Cleanup function: destroy the effect when the component unmounts
    // This is crucial to prevent memory leaks in React
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} style={{ minHeight: '100vh', width: '100%' }}>
      {/* Your actual page content goes inside this div */}
      <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
        {children || <h1>Hello Vanta Halo Effect!</h1>}
      </div>
    </div>
  );
};

export default VantaHaloBackground;