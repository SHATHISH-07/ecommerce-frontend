import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "../../graphql/queries/category.query";
import { AlertTriangle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Category {
  name: string;
  slug: string;
  thumbnail: string;
}

const SkeletonCard = () => (
  <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3">
    <div className="animate-pulse flex items-center justify-center h-48 bg-gray-200 dark:bg-gray-700 rounded-lg">
      <Loader className="text-gray-500 animate-spin" size={30} />
    </div>
  </div>
);

const Categories = () => {
  const { loading, error, data } = useQuery(GET_ALL_CATEGORIES);

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Discover Our Categories
        </h2>
        <div className="flex flex-wrap -mx-3 justify-center">
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

  const categories = data?.getCategories || [];

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Discover Our Categories
      </h2>
      {categories.length > 0 ? (
        <div className="flex flex-wrap -mx-3 justify-center">
          {categories.map((category: Category) => (
            <div
              key={category.slug}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3"
              onClick={() => navigate(`/categories/${category.slug}`)}
            >
              <div
                className="group relative flex items-center justify-center text-center p-4 h-48 rounded-lg cursor-pointer overflow-hidden signup-shadow"
                style={{
                  backgroundImage: `url(${category.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                <span className="relative z-10 text-xl font-semibold text-white transition-colors">
                  {category.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No categories found.</p>
      )}
    </div>
  );
};

export default Categories;
