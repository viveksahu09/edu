import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  console.log("HeroSection component is rendering!");
  
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white" style={{ minHeight: '70vh' }}>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Education"
          className="w-full h-full object-cover opacity-50"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%234F46E5'/%3E%3C/svg%3E";
          }}
        />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: '70vh' }}>
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
            <Link 
              to="/login" 
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Get Started
            </Link>
            <Link 
              to="/about" 
              className="px-8 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors inline-block"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
