import React from "react";
import HeroSection from "../components/home/HeroSection";
import UniversitySlider from "../components/home/UniversitySlider";
import Layout from "../components/layout/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto ">
        <HeroSection />
        <UniversitySlider />
      </div>
    </Layout>
  );
}
