import { Star } from "lucide-react";
import type { Product } from "../../types/products";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TO_CART } from "../../graphql/mutations/cart";
import { GET_USER_CART_COUNT } from "../../graphql/queries/cart.query";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../../utils/useAppToast";

const MobileProductCard = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_USER_CART_COUNT }],
    awaitRefetchQueries: true,
  });

  const originalPrice = product.price / (1 - product.discountPercentage / 100);

  const navigate = useNavigate();
  const { toastCartSuccess, toastError } = useAppToast();

  const handleAddToCart = async () => {
    try {
      const { data } = await addToCart({
        variables: {
          input: {
            productId: product.id,
            quantity,
          },
        },
      });

      if (data?.addToCart?.success) {
        toastCartSuccess(data.addToCart.message);
      } else {
        toastError("Failed to add to cart");
      }
    } catch (error) {
      console.error(error);
      toastError("Error adding to cart. Please sign up or login");
    }
  };

  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg border shadow-lg transition-shadow duration-300 hover:shadow-xl cursor-pointer"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-48 w-full object-cover"
      />
      <div className="flex flex-grow flex-col p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {product.title}
        </h3>

        <div className="flex flex-col gap-3">
          {/* Price Section */}
          <div className="flex flex-wrap items-baseline gap-x-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </p>
            <del className="text-sm text-gray-500 dark:text-gray-400">
              ${originalPrice.toFixed(2)}
            </del>
            <span className="text-sm font-semibold text-green-600">
              {Math.round(product.discountPercentage)}% off
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 text-sm text-yellow-500">
            <p className="flex items-center gap-1">
              {product.rating != null ? product.rating.toFixed(1) : "N/A"}{" "}
              <Star size={16} fill="yellow" />
            </p>
            <div className="flex items-center gap-1 text-sm">
              <div className="flex items-center gap-2 border border-gray-800 dark:border-gray-300 rounded-md px-2 py-1 w-fit">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity((prev) => Math.max(1, prev - 1));
                  }}
                  className="px-2 py-1 text-lg font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  -
                </button>
                <span className="min-w-[2ch] text-black dark:text-white text-center">
                  {quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity((prev) => Math.min(10, prev + 1));
                  }}
                  className="px-2 py-1 text-lg font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={loading}
              className="flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg bg-gradient-to-r from-[#c9812f] to-blue-500 cursor-pointer font-semibold disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProductCard;
