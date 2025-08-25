import { ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { type Product } from "../../types/products";
import StarRating from "./StarRating";
import AvailabilityStatus from "./AvailabilityStatus";
import PolicyInfo from "./PolicyInfo";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TO_CART } from "../../graphql/mutations/cart";
import { GET_USER_CART_COUNT } from "../../graphql/queries/cart.query";

const DesktopProductCard = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_USER_CART_COUNT }],
    awaitRefetchQueries: true,
  });

  const originalPrice = product.price / (1 - product.discountPercentage / 100);

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
        alert(data.addToCart.message);
      } else {
        alert("Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding to cart");
    }
  };

  return (
    <div className="flex gap-4 border rounded-sm overflow-hidden border-gray-500 bg-white dark:bg-black w-full">
      {/* Image Section */}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-70 h-auto object-cover border-r-1 border-gray-500 bg-gray-100 dark:bg-black"
      />

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {product.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {product.category}
          </p>
          <div className="mt-2">
            <StarRating rating={product.rating} />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-xl line-clamp-3">
            {product.description}
          </p>
        </div>

        <div>
          {/* Policies section */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 mb-3">
            <PolicyInfo Icon={ShieldCheck} text={product.returnPolicy} />
            <div className="h-4 border-l border-gray-300" />
            <PolicyInfo Icon={Truck} text={product.warrantyInformation} />
          </div>

          <div className="mb-3">
            <AvailabilityStatus status={product.availabilityStatus} />
          </div>

          <div className="flex justify-between items-center">
            {/* Price section */}
            <div className="flex items-baseline gap-2">
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

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-gray-800 dark:border-gray-300 rounded-md px-2 py-1 w-fit">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-2 py-1 text-lg font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  -
                </button>
                <span className="min-w-[2ch] text-center text-black dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
                  className="px-2 py-1 text-lg font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg bg-gradient-to-r from-[#c9812f] to-blue-500 cursor-pointer font-semibold disabled:opacity-50"
                >
                  <ShoppingCart size={20} />
                  {loading ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopProductCard;
