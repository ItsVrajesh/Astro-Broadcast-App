import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
// 1. Import CELLS instead of BIRDS or HALO
import CELLS from 'vanta/dist/vanta.cells.min';

const VantaCellsBackground = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    // Initialize the Vanta effect
    if (!vantaEffect) {
      setVantaEffect(
        CELLS({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          // Customizing colors to match your Astro UI theme:
          color1: 0x8b5cf6, // Your purple brand color
          color2: 0x4f46e5, // Deep indigo
          size: 1.50,
          speed: 1.50
        })
      );
    }
    
    // Cleanup function: destroy the effect when the user logs out
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    // Note: Added backgroundColor to the style to ensure a dark base
    <div ref={vantaRef} style={{ minHeight: '100vh', width: '100%', backgroundColor: '#111827' }}>
      {/* This wrapper ensures your Chat UI stays on top of the 3D canvas */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
};

export default VantaCellsBackground;