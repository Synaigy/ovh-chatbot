
import React from 'react';

const Banner = () => {
  return (
    <div className="w-full py-24 md:py-32 bg-gradient-to-r from-black via-gray-900 to-red-900 shadow-lg">
      <div className="container mx-auto px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-left leading-tight text-white">
          OVHcloud AI Endpoints
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-left mt-2 text-white opacity-90">
          Ein Deepdive der synaigy
        </p>
      </div>
    </div>
  );
};

export default Banner;
