import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID_SIDE_CART_SHOW } from "../../graphql/queries/products.query";
import { type Product } from "../../types/products";
import { Star } from "lucide-react";

const CartProductCard = ({ productId }: { productId: number }) => {
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID_SIDE_CART_SHOW, {
    variables: { id: productId },
  });

  if (loading) {
    return <p className="p-2 text-sm text-gray-400">Loading item...</p>;
  }
  if (error) {
    return <p className="p-2 text-sm text-red-500">Error loading item.</p>;
  }

  const product: Product | undefined = data?.getProductById;

  if (!product) {
    return null;
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
