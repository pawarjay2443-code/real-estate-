import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Categories from "@/components/home/Categories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import LatestProperties from "@/components/home/LatestProperties";
import CTA from "@/components/home/CTA";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturedProperties />
        <Categories />
        <WhyChooseUs />
        <LatestProperties />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
