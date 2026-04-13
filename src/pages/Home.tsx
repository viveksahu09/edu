import HeroSection from "../components/home/HeroSection";
import UniversitySlider from "../components/home/UniversitySlider";
import Layout from "../components/layout/Layout";

export default function Home() {
  console.log("Home component is rendering!");
  console.log("Current URL:", window.location.href);
  
  return (
    <Layout>
      <div className="container mx-auto ">
        <HeroSection />
        <UniversitySlider />
      </div>
    </Layout>
  );
}
