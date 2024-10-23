// components/HeroBanner.tsx
import React from "react";

const HeroBanner: React.FC = () => {
  return (
    <div className="relative bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold">Welcome to Your Exchange</h1>
        <p className="mt-4 text-lg">
          Trade cryptocurrencies with ease and confidence.
        </p>
        <div className="mt-8">
          <a
            href="#"
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
          >
            Get Started
          </a>
        </div>
      </div>
      <div className="absolute inset-0">
        <img
          className="object-cover w-full h-full"
          src="/path/to/your/image.jpg" // Replace with your image path
          alt="Hero Banner"
        />
        <div className="absolute inset-0 bg-black opacity-30" />
      </div>
    </div>
  );
};

export default HeroBanner;
