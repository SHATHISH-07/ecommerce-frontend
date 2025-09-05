import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID_SIDE_CART_SHOW } from "../../graphql/queries/products.query";
import { type Product } from "../../types/products";
import { AlertTriangle, Star } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const CartProductCard = ({ productId }: { productId: number }) => {
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID_SIDE_CART_SHOW, {
    variables: { id: productId },
  });

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

  const product: Product | undefined = data?.getProductById;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          Oops! Something went wrong.
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">
          We couldn't load the Cart. Please try again later.
        </p>
        <p className="text-xs text-gray-500 mt-4 italic">
          Error : Product not found
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === "In Stock") return "text-green-500";
    if (status === "Low Stock") return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3 p-2 mb-2 border-b border-gray-500">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-16 h-16 rounded object-cover shrink-0"
      />
      <div className="flex flex-col justify-center items-center text-center w-full">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-300 leading-tight line-clamp-2">
          {product.title}
        </p>

        <div className="flex-grow" />

        <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
          ${product.price}
        </p>

        <span className="flex items-center gap-1 text-xs text-yellow-500 mt-1">
          {product.rating.toFixed(1)}
          <Star size={12} fill="currentColor" />
        </span>

        <p
          className={`text-xs font-medium mt-1 ${getStatusColor(
            product.availabilityStatus
          )}`}
        >
          {product.availabilityStatus}
        </p>
      </div>
    </div>
  );
};

export default CartProductCard;
