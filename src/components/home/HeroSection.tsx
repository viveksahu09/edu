import React from "react";
import { GraduationCap } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Education"
          className="w-full h-full object-cover mix-blend-multiply"
        />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div className="text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-8" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Your Journey to Excellence Starts Here
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl">
            Access quality education resources from top universities worldwide.
            Learn, grow, and achieve your academic goals.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
