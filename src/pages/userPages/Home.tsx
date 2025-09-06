import { useQuery } from "@apollo/client";
import HeroBanner from "../../components/home/HeroBanner";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { GET_ALL_BANNERS } from "../../graphql/queries/banner.query";
import HomeCategorySection from "../../components/home/HomeCategorySection";
import OfferSection from "../../components/home/OfferSection";
import TestimonialSection from "../../components/home/TestimonialSection";
import HomeProducts from "../../components/home/HomeProducts";
import { AlertTriangle } from "lucide-react";

interface Banner {
  id: number;
  imageUrl: string;
}

export default function HomePage() {
  const { data, loading, error } = useQuery(GET_ALL_BANNERS);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          Oops! Something went wrong.
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">
          We couldn't load the categories. Please try again later.
        </p>
        <p className="text-xs text-gray-500 mt-4 italic">
          Error: {error.message}
        </p>
      </div>
    );
  }

  const bannerImages = data?.getAllBanners.map((b: Banner) => b.imageUrl) || [];

  return (
    <div>
      <HeroBanner images={bannerImages} interval={2000} />
      <HomeCategorySection />
      <OfferSection />
      <HomeProducts />
      <TestimonialSection />
    </div>
  );
}
