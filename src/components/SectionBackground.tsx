import React from 'react';

export function SectionBackground() {
  return (
    <>
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(17 24 39 / 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(17 24 39 / 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 70%, transparent 110%)'
        }}
      />
      
      {/* Blue Glow Effect */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)'
          }}
        />
      </div>
    </>
  );
}