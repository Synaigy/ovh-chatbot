
import React from 'react';

const Banner = () => {
  return (
    <div className="w-full py-12 md:py-16 bg-gradient-to-r from-red-900 via-red-800 to-red-700 shadow-lg">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center leading-tight text-white">
          OVHcloud AI Endpoints: <span className="highlight-text block md:inline">Ein Deepdive der synaigy</span>
        </h1>
      </div>
    </div>
  );
};

export default Banner;
