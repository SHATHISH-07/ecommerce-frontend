import { ShieldCheck, ShoppingCart, Trash2, Truck } from "lucide-react";
import { type Product } from "../../types/products";
import StarRating from "../products/StarRating";
import AvailabilityStatus from "../products/AvailabilityStatus";
import PolicyInfo from "../products/PolicyInfo";
import { useMutation } from "@apollo/client";
import { REMOVE_CART_ITEM } from "../../graphql/mutations/cart";
import QuantitySelector from "./QuantitySelector";
import { UPDATED_USER_CART_QUANTITY } from "../../graphql/queries/cart.query";

const DesktopCartCard = ({
  product,
  productId,
  quantity,
}: {
  product: Product;
  productId: number;
  quantity: number;
}) => {
  const [removeCartItem] = useMutation(REMOVE_CART_ITEM, {
    refetchQueries: ["GetUserCart"],
  });

  const [updateUserCart] = useMutation(UPDATED_USER_CART_QUANTITY, {
    refetchQueries: ["GetUserCart"],
  });

  const handleQuantityChange = async (newQty: number) => {
    try {
      await updateUserCart({
        variables: { productId, quantity: newQty },
      });
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const handleRemove = async () => {
    await removeCartItem({ variables: { productId: productId } });
  };

  const originalPrice = product.price / (1 - product.discountPercentage / 100);

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
        <div className="flex justify-between items-start">
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
          </div>

          {/* Remove button */}
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-3 text-xl line-clamp-3">
          {product.description}
        </p>

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

            <QuantitySelector
              initialQuantity={quantity}
              onChange={handleQuantityChange}
            />

            {/* Order Button */}
            <button className="flex items-center gap-2 text-white px-4 py-2 rounded-lg bg-gradient-to-r from-[#c9812f] to-blue-500 cursor-pointer font-semibold">
              <ShoppingCart size={18} />
              <span>Order now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopCartCard;
