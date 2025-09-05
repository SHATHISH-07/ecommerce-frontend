import { useEffect, useState } from "react";
import type { DetailedProduct } from "../../types/products";
import {
  Tag,
  Package,
  CheckCircle,
  Weight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import PolicyDetailInfo from "./PolicyDetailInfo";
import AvailabilityStatus from "./AvailabilityStatus";
import StarRating from "./StarRating";
import { useMutation } from "@apollo/client";
import { ADD_TO_CART } from "../../graphql/mutations/cart";
import { GET_USER_CART_COUNT } from "../../graphql/queries/cart.query";
import { useAppToast } from "../../utils/useAppToast";
import FullscreenImageModal from "./FullScreenImageModal";
import { useNavigate } from "react-router-dom";

interface ProductDetailCardProps {
  product: DetailedProduct;
}

const ProductDetailCard = ({ product }: ProductDetailCardProps) => {
  const [mainImage, setMainImage] = useState<string>(product.thumbnail);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const { toastCartSuccess, toastError } = useAppToast();

  const navigate = useNavigate();

  // Mutation
  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_USER_CART_COUNT }],
    awaitRefetchQueries: true,
  });

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
    } catch (err) {
      console.error(err);
      toastError("Error adding to cart");
    }
  };

  const handleBuyNow = () => {
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

  const maxQuantity = Math.min(product.stock, 10);

  const detailConfig = (product: DetailedProduct) => [
    { Icon: Tag, text: `Category: ${product.category}` },
    { Icon: Package, text: `Brand: ${product.brand}` },
    { Icon: CheckCircle, text: `Stock: ${product.stock}` },
    { Icon: Weight, text: `Weight: ${product.weight} kg` },
    { Icon: ShieldCheck, text: `Warranty: ${product.warrantyInformation}` },
    { Icon: Truck, text: `Shipping: ${product.shippingInformation}` },
    { Icon: RotateCcw, text: `Return Policy: ${product.returnPolicy}` },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    setMainImage(product.thumbnail);
    setQuantity(1);
  }, [product]);

  // Quantity stepper
  const QuantityStepper = () => (
    <div className="flex items-center border border-gray-800 dark:border-gray-300 rounded-lg w-32 justify-between">
      <button
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        className="px-3 py-2 text-lg font-bold cursor-pointer rounded-l-lg"
      >
        −
      </button>
      <span className="px-4 font-medium">{quantity}</span>
      <button
        onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
        className="px-3 py-2 text-lg font-bold cursor-pointer rounded-r-lg"
      >
        +
      </button>
    </div>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left - Images */}
        <div className="flex-1">
          <img
            src={mainImage}
            alt={product.title}
            className="rounded-lg shadow-md w-full h-96 object-contain bg-gray-100 dark:bg-gray-400 transition-all duration-300 cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
          <div className="flex gap-2 mt-4 flex-wrap">
            {[product.thumbnail, ...(product.images || [])].map(
              (img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`product-${idx}`}
                  className={`w-20 h-20 object-cover rounded border cursor-pointer transition-all duration-200 ${
                    img === mainImage ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setMainImage(img)}
                />
              )
            )}
          </div>

          {product.dimensions && (
            <div className="text-sm mt-7">
              <div className="ml-4 flex gap-10">
                <div className="flex flex-col">
                  <span className="font-medium">Width</span>
                  <span>{product.dimensions.width.toFixed(0)} cm</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Height</span>
                  <span>{product.dimensions.height.toFixed(0)} cm</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Depth</span>
                  <span>{product.dimensions.depth.toFixed(0)} cm</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right - Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {product.description}
          </p>

          {/* Price + Discount */}
          <div className="flex items-center gap-3 mt-2">
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            {product.discountPercentage && (
              <>
                <del className="text-sm text-gray-500">
                  $
                  {(
                    product.price /
                    (1 - product.discountPercentage / 100)
                  ).toFixed(2)}
                </del>
                <span className="text-sm font-semibold text-green-600">
                  {Math.round(product.discountPercentage)}% off
                </span>
              </>
            )}
          </div>

          <StarRating rating={product.rating} />
          <AvailabilityStatus status={product.availabilityStatus} />

          {/* Small screen buttons */}
          <div className="md:hidden mt-4 space-y-3">
            <QuantityStepper />

            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full  text-white py-2 rounded-lg font-semibold bg-gradient-to-r from-[#c9812f] to-blue-500 hover:opacity-90 transition cursor-pointer"
            >
              {loading ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full text-white py-2 rounded-lg font-semibold bg-gradient-to-r from-[#c9812f] to-blue-500 hover:opacity-90 transition cursor-pointer"
            >
              Buy Now
            </button>
          </div>

          {/* Product details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {detailConfig(product).map((item, idx) => (
              <PolicyDetailInfo key={idx} Icon={item.Icon} text={item.text} />
            ))}
          </div>
        </div>
      </div>

      {/* Large screen buttons */}
      <div className="hidden md:flex justify-center gap-4 mt-8">
        <QuantityStepper />
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="px-15 py-2 0 text-white rounded-lg font-semibold bg-gradient-to-r from-[#c9812f] to-blue-500 hover:opacity-90 transition cursor-pointer"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          className="px-20 py-2  text-white rounded-lg font-semibold bg-gradient-to-r from-[#c9812f] to-blue-500 hover:opacity-90 transition cursor-pointer"
        >
          Buy Now
        </button>
      </div>

      {/* Fullscreen Modal */}
      {isOpen && (
        <FullscreenImageModal mainImage={mainImage} setIsOpen={setIsOpen} />
      )}
    </>
  );
};

export default ProductDetailCard;
