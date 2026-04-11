import React from "react";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">About EduSolGrow</h1>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            Empowering students worldwide with accessible, quality education
            resources and innovative learning solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { icon: BookOpen, title: "Quality Content", value: "10,000+" },
            { icon: Users, title: "Active Students", value: "50,000+" },
            { icon: Award, title: "Universities", value: "100+" },
            { icon: TrendingUp, title: "Success Rate", value: "95%" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <stat.icon className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-300">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg mb-8">
            At EduSolGrow, we believe that quality education should be
            accessible to everyone. Our platform bridges the gap between
            students and educational resources, making learning more efficient
            and enjoyable.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">What We Offer</h3>
              <ul className="space-y-2">
                <li>✓ Comprehensive study materials</li>
                <li>✓ Interactive learning tools</li>
                <li>✓ Expert guidance</li>
                <li>✓ Collaborative learning environment</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Why Choose Us</h3>
              <ul className="space-y-2">
                <li>✓ Trusted by leading universities</li>
                <li>✓ Regularly updated content</li>
                <li>✓ Personalized learning paths</li>
                <li>✓ 24/7 support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
