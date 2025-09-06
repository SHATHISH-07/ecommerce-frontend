import { GET_ALL_CATEGORIES } from "../../graphql/queries/category.query";
import { useQuery } from "@apollo/client";
import { AlertTriangle, Loader, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

interface Category {
  name: string;
  slug: string;
  thumbnail: string;
}

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-40 sm:w-48 md:w-56 mr-4">
    <div className="animate-pulse flex items-center justify-center h-32 sm:h-40 bg-gray-200 dark:bg-gray-700 rounded-lg">
      <Loader className="text-gray-500 animate-spin" size={30} />
    </div>
  </div>
);

const HomeCategorySection = () => {
  const { loading, error, data } = useQuery(GET_ALL_CATEGORIES);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Discover Our Categories
        </h2>
        <div className="flex overflow-x-auto no-scrollbar">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
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

  const categories: Category[] = data?.getCategories || [];
  const displayed = categories.slice(0, 9); // show 9 actual categories
  const hasMore = categories.length > 9;

  return (
    <div className="container mx-auto px-4 py-10 relative">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Discover Our Categories
      </h2>

      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-0 top-4/7  border border-gray-800 dark:border-white cursor-pointer -translate-y-1/2 bg-white/70  dark:bg-black/70 shadow rounded-full p-2 z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Scrollable Categories */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 no-scrollbar pb-4 scroll-smooth"
      >
        {displayed.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => navigate(`/categories/${cat.slug}`)}
            className="flex-shrink-0 w-40 sm:w-48 md:w-56 cursor-pointer group"
          >
            <div className="h-32 sm:h-40 rounded-lg overflow-hidden shadow-md relative">
              <img
                src={cat.thumbnail}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-semibold">{cat.name}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Last "View All" Card */}
        {hasMore && (
          <div
            onClick={() => navigate("/categories")}
            className="flex-shrink-0 w-40 sm:w-48 md:w-56 cursor-pointer group"
          >
            <div className="h-32 sm:h-40 rounded-lg overflow-hidden shadow-md flex items-center justify-center bg-gradient-to-r from-[#c38241] to-blue-500">
              <span className="text-white font-bold text-lg">View All →</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-0 top-4/7 border border-gray-800 dark:border-white -translate-y-1/2 bg-white/70 dark:bg-black/70 shadow cursor-pointer rounded-full p-2 z-10 "
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default HomeCategorySection;
