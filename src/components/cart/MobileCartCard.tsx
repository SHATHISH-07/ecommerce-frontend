import { ShoppingCart, Trash2 } from "lucide-react";
import type { Product } from "../../types/products";
import { useApolloClient, useMutation } from "@apollo/client";
import { REMOVE_CART_ITEM } from "../../graphql/mutations/cart";
import QuantitySelector from "./QuantitySelector";
import { UPDATED_USER_CART_QUANTITY } from "../../graphql/queries/cart.query";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../../utils/useAppToast";
import { checkUserStatus } from "../../utils/checkUserStatus";

const MobileCartCard = ({
  product,
  productId,
  quantity,
}: {
  product: Product;
  productId: number;
  quantity: number;
}) => {
  const client = useApolloClient();

  const [removeCartItem] = useMutation(REMOVE_CART_ITEM, {
    refetchQueries: ["GetUserCart"],
  });

  const [updateUserCart] = useMutation(UPDATED_USER_CART_QUANTITY, {
    refetchQueries: ["GetUserCart"],
  });

  const navigate = useNavigate();

  const { toastSuccess, toastError } = useAppToast();

  const handleQuantityChange = async (newQty: number) => {
    try {
      await updateUserCart({
        variables: { productId, quantity: newQty },
      });
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      toastError("Error updating cart quantity");
    }
  };

  const handleRemove = async () => {
    await removeCartItem({ variables: { productId: productId } });
    toastSuccess("Product removed from cart");
  };

  const handleBuyNow = async () => {
    const valid = await checkUserStatus(client);

    if (!valid) return;

    navigate("/placeorder", {
      state: {
        products: [
          {
            id: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: product.price,
            quantity,
            returnPolicy: product.returnPolicy,
          },
        ],
      },
    });
  };

  const originalPrice = product.price / (1 - product.discountPercentage / 100);

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="flex flex-col border border-gray-300 overflow-hidden  bg-white dark:bg-black h-full"
    >
      {/* Image */}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-48 w-full object-contain"
      />

      {/* Content */}
      <div className="flex flex-col p-4 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold truncate">{product.title}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            <Trash2 size={35} />
          </button>
        </div>

        {/* Price */}
        <div className="flex items-baseline overflow-hidden gap-2 mb-3">
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </p>
          <del className="text-sm text-gray-500 dark:text-gray-400">
            ${originalPrice.toFixed(2)}
          </del>
          <span className="text-sm font-semibold text-green-600">
            {Math.round(product.discountPercentage)}% off
          </span>
        </div>

        <div className="mb-4">
          <QuantitySelector
            initialQuantity={quantity}
            onChange={handleQuantityChange}
          />
        </div>

        {/* Push button to bottom */}
        <div className="mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBuyNow();
            }}
            className="flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg bg-gradient-to-r from-[#c9812f] to-blue-500 cursor-pointer font-semibold w-full"
          >
            <ShoppingCart size={18} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCartCard;
