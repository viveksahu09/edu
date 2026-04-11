import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { universities } from "../../data/universities";
import UniversityCard from "./UniversityCard";
import { useTheme } from "../../context/ThemeContext";

export default function UniversitySlider() {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerSlide = 3;

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + itemsPerSlide >= filteredUniversities.length
        ? 0
        : prev + itemsPerSlide
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - itemsPerSlide < 0
        ? Math.max(0, filteredUniversities.length - itemsPerSlide)
        : prev - itemsPerSlide
    );
  };

  return (
    <section className={`py-12 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-column justify-between">
          <h2
            className={`text-3xl font-bold mb-8 flex-column  ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Featured Universities
          </h2>

          <div className="flex flex-column-1 justify-between items-center mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Conditional rendering for "Record Not Found" message */}
          {filteredUniversities.length === 0 && searchTerm && (
            <div className="text-center text-gray-500 mt-4">
              Record Not Found
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white rounded-full p-2 shadow-lg z-10"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  startIndex * (100 / itemsPerSlide)
                }%)`,
              }}
            >
              {filteredUniversities.map((university) => (
                <div key={university.id} className="flex-none w-1/3 px-4">
                  <UniversityCard university={university} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white rounded-full p-2 shadow-lg z-10"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div
          className="relative inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://cdn.pixabay.com/photo/2021/11/29/01/53/distance-learning-6831603_1280.png")`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-75" />

          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <div className="text-center ">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl relative">
                <span className="absolute inset-0  rounded-lg blur-md" />
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  You don’t have to be great to start, but you have to start to
                  be great.
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
