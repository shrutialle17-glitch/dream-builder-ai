import React from 'react';

export default function Logo({ className = '' }) {
  return (
    <>
      <img 
        src="/assets/images/logo2.png" 
        alt="Dream Builder AI" 
        className={`h-8 w-auto object-contain logo-light ${className}`} 
      />
      <img 
        src="/assets/images/logo.png" 
        alt="Dream Builder AI" 
        className={`h-8 w-auto object-contain logo-dark ${className}`} 
      />
    </>
  );
}
