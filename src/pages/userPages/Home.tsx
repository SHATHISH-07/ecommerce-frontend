import { useQuery } from "@apollo/client";
import HeroBanner from "../../components/home/HeroBanner";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { GET_ALL_BANNERS } from "../../graphql/queries/banner.query";
import HomeCategorySection from "../../components/home/HomeCategorySection";
import OfferSection from "../../components/home/OfferSection";
import TestimonialSection from "../../components/home/TestimonialSection";
import HomeProducts from "../../components/home/HomeProducts";

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
  if (error) return <p className="text-red-500">Failed to load banners</p>;

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
