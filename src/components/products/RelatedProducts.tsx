import { GET_PRODUCTS_BY_CATEGORY } from "../../graphql/queries/category.query";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useRef } from "react";

interface Product {
  id: string;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  rating: number;
}

const RelatedProducts = ({ categorySlug }: { categorySlug: string }) => {
  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { categorySlug },
    skip: !categorySlug,
  });

  const products: Product[] = data?.getProductsByCategory?.products ?? [];
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -clientWidth : clientWidth,
        behavior: "smooth",
      });
    }
  };

  if (loading) return <p className="p-4">Loading related products...</p>;
  if (error)
    return <p className="p-4 text-red-500">Failed to load related products.</p>;
  if (products.length === 0) return null;

  return (
    <div className="mt-6 relative">
      <h2 className="text-lg font-semibold mb-3">Related Products</h2>

      {/* Left Scroll Button */}
      <button
        onClick={() => scroll("left")}
        className="
    absolute left-0 top-1/2 -translate-y-1/2 z-10
    p-3 rounded-full
    bg-gradient-to-br from-white/90 via-white/70 to-gray-200
    dark:from-gray-800 dark:via-gray-700 dark:to-gray-600
    shadow-lg border border-gray-300 dark:border-gray-700
    cursor-pointer overflow-hidden
    hover:brightness-110 transition
  "
      >
        {/* Shine effect */}
        <span className="absolute -top-1/2 left-0 w-full h-1/2 bg-white/50 rounded-full blur-md pointer-events-none"></span>

        <ChevronLeft className="relative w-5 h-5 text-gray-800 dark:text-white" />
      </button>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 custom-horizontal-scrollbar scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/products/${product.id}`)}
            className="w-[200px]md:w-[300px] h-[320px] cursor-pointer rounded-lg border border-gray-300 p-3 shadow-sm hover:shadow-md transition flex-shrink-0 bg-white dark:bg-black flex flex-col"
          >
            {/* Image Area */}
            <div className="flex items-center justify-center h-auto w-full bg-gray-50 dark:bg-[#232222] rounded-md">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-50 w-50 md:w-60 object-contain"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between flex-1 mt-3">
              <h3 className="text-sm font-medium line-clamp-2 min-h-[40px]">
                {product.title}
              </h3>

              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </p>
                  <span className="text-xs text-green-600">
                    {Math.round(product.discountPercentage)}% off
                  </span>
                </div>
                <div>
                  <span className="flex items-center text-sm">
                    {product.rating.toFixed(1)}
                    <Star
                      size={12}
                      fill="#FFD700"
                      className="inline-block mr-1"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll("right")}
        className="
    absolute right-0 top-1/2 -translate-y-1/2 z-10
    p-3 rounded-full
    bg-gradient-to-br from-white/90 via-white/70 to-gray-200
    dark:from-gray-800 dark:via-gray-700 dark:to-gray-600
    shadow-lg border border-gray-300 dark:border-gray-700
    cursor-pointer overflow-hidden
    hover:brightness-110 transition
  "
      >
        {/* Shine effect */}
        <span className="absolute -top-1/2 left-0 w-full h-1/2 bg-white/50 rounded-full blur-md pointer-events-none"></span>

        <ChevronRight className="relative w-5 h-5 text-gray-800 dark:text-white" />
      </button>
    </div>
  );
};

export default RelatedProducts;
