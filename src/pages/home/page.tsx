import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroSection from './components/HeroSection';
import OffersSection from './components/OffersSection';
import CollectionsSection from './components/CollectionsSection';
import TrendingLocations from './components/TrendingLocations';
import TrendingSection from './components/TrendingSection';
import AIPlannerWidget from './components/AIPlannerWidget';
import FeaturedProperties from './components/FeaturedProperties';
import ExperiencesSection from './components/ExperiencesSection';
import HowItWorks from './components/HowItWorks';
import WhyTriprodeo from './components/WhyTriprodeo';
import ReviewsSection from './components/ReviewsSection';
import LoyaltySection from './components/LoyaltySection';
import NewsletterSection from './components/NewsletterSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      {/* Offers section – live host promotions, right below the banner */}
      <OffersSection />
      <CollectionsSection />
      {/* Trending Locations */}
      <TrendingLocations />
      {/* Trending Properties */}
      <TrendingSection />
      {/* AI Planner Widget */}
      <AIPlannerWidget />
      <FeaturedProperties />
      <ExperiencesSection />
      <HowItWorks />
      {/* Why Triprodeo – above reviews */}
      <WhyTriprodeo />
      <ReviewsSection />
      <LoyaltySection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}

