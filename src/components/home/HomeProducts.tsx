import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Loader, AlertTriangle, Star } from "lucide-react";
import { GET_ALL_PRODUCTS } from "../../graphql/queries/products.query";
import type { Product } from "../../types/products";

const HomeProducts = () => {
  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS, {
    variables: { limit: 10, skip: 80 },
  });
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader className="animate-spin w-8 h-8 text-gray-600 dark:text-gray-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          Failed to load products
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">{error.message}</p>
      </div>
    );
  }

  const products: Product[] = data?.getAllProducts?.products || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Featured Products
      </h2>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/products/${product.id}`)}
            className="cursor-pointer bg-white dark:bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition-shadow p-3 flex flex-col"
          >
            <div className="w-full h-40 sm:h-48 rounded-lg overflow-hidden">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-3 flex flex-col flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-[#c38241] font-bold mt-1">${product.price}</p>
              <div className="flex items-center text-yellow-500 mt-1">
                <Star className="w-4 h-4 fill-yellow-500" />
                <span className="text-sm ml-1 text-gray-600 dark:text-gray-300">
                  {product.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Products Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-[#c38241] to-blue-500 text-white shadow hover:scale-105 cursor-pointer transition-transform"
        >
          View All Products →
        </button>
      </div>
    </div>
  );
};

export default HomeProducts;
