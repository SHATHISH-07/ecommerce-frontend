import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface BannerProps {
  images: string[];
  interval?: number;
}

const HeroBanner = ({ images, interval = 3000 }: BannerProps) => {
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="w-full mt-5 mb-10">
      {/* Banner Section (just the image) */}
      <div className="relative w-full h-[50vh] md:h-[55vh] mx-auto overflow-hidden rounded-2xl">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`banner-${i}`}
            className={`absolute top-0 left-0 w-full h-full object-fit md:object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Content Section (below the banner) */}
      <div className="mt-5 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-300">
          Welcome to NxKart
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-600 dark:text-gray-400">
          Shop the best products at unbeatable prices
        </p>
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <button
            onClick={() => navigate("/products")}
            className="px-12 py-3  text-white font-semibold rounded-full shadow bg-gradient-to-r from-[#c9812f] to-blue-500 cursor-pointer"
          >
            Shop Now
          </button>
          <button
            onClick={() => navigate("/categories")}
            className="px-6 py-3 border-2 border-black dark:border-gray-300 font-semibold rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer"
          >
            Explore Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
