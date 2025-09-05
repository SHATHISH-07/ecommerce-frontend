import { useParams, useNavigate } from "react-router-dom";
import { GET_USER_ORDER_BY_ID } from "../../graphql/queries/userOrder.query";
import { useQuery, useMutation } from "@apollo/client";
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Truck,
  ShoppingCart,
} from "lucide-react";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { CANCEL_ORDER, RETURN_ORDER } from "../../graphql/mutations/order";
import { useAppToast } from "../../utils/useAppToast";
import { useState } from "react";
import CancelOrderModal from "../../components/order/CancelOrderModal";
import ReturnOrderModal from "../../components/order/ReturnOrderModal";

interface Product {
  externalProductId: number;
  title: string;
  thumbnail: string;
  priceAtPurchase: number;
  quantity: number;
  returnPolicy: string;
  returnExpiresAt?: string;
}

interface Order {
  id: string;
  products: Product[];
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  deliveredAt?: string;
}

const steps = [
  { label: "Processing", icon: ShoppingCart },
  { label: "Packed", icon: Package },
  { label: "Shipped", icon: Truck },
  { label: "Out_for_Delivery", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 },
];

const nonCancellableStatuses = ["Shipped", "Out_for_Delivery", "Delivered"];

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useAppToast();

  const { data, loading, error, refetch } = useQuery(GET_USER_ORDER_BY_ID, {
    variables: { orderId: id },
    fetchPolicy: "network-only",
  });

  const [cancelOrder] = useMutation(CANCEL_ORDER);
  const [returnOrder] = useMutation(RETURN_ORDER);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const order: Order = data?.getOrderById;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg mx-auto text-center">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
          Oops! Something went wrong.
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">
          We couldn't load the order. Please try again later.
        </p>
      </div>
    );
  }

  const handleConfirmCancel = async (reason: string) => {
    try {
      const res = await cancelOrder({
        variables: { orderId: order.id, reason },
      });
      if (res.data?.cancelOrder.success) {
        toastSuccess(res.data.cancelOrder.message);
        refetch();
        navigate("/orders");
        setShowCancelModal(false);
      } else {
        toastError(res.data?.cancelOrder.message || "Cancellation failed.");
      }
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Unexpected error.");
    }
  };

  const handleReturnOrder = async (reason: string) => {
    try {
      const res = await returnOrder({
        variables: { orderId: order.id, reason },
      });
      if (res.data?.returnOrder.success) {
        toastSuccess(res.data.returnOrder.message);
        refetch();
        setShowReturnModal(false);
      } else {
        toastError(res.data?.returnOrder.message || "Return failed.");
      }
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Unexpected error.");
    }
  };

  const currentStepIndex = steps.findIndex(
    (s) => s.label === order.orderStatus
  );

  const isReturnable = (product: Product) => {
    if (!product.returnExpiresAt) return false;
    const expiry = new Date(product.returnExpiresAt);
    return new Date() <= expiry && product.returnPolicy !== "No return policy";
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Track Your Order</h2>

      {/* Products */}
      <div className="space-y-4 mb-8">
        {order.products.map((product, i) => (
          <div
            key={i}
            onClick={() => navigate(`/products/${product.externalProductId}`)}
            className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:shadow-md transition dark:border-gray-700"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div>
              <p className="font-semibold">{product.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Price: ₹{product.priceAtPurchase}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Qty: {product.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div className="p-6  border border-gray-200 dark:border-gray-700 rounded-xl shadow-md mb-8 space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Order Summary
        </h3>

        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Order ID:
          </span>
          <span className="text-gray-900 dark:text-white">{order.id}</span>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Payment:
          </span>
          <span className="text-gray-900 dark:text-white">
            {order.paymentMethod} ({order.paymentStatus})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-yellow-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Total:
          </span>
          <span className="text-gray-900 dark:text-white">
            ₹{order.totalAmount}
          </span>
        </div>

        {order.deliveredAt && (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Delivered on:
            </span>
            <span className="text-gray-900 dark:text-white">
              {new Date(order.deliveredAt).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Optional: status badge */}
        <div className="mt-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.orderStatus === "Delivered"
                ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
            }`}
          >
            {order.orderStatus.replaceAll("_", " ")}
          </span>
        </div>
      </div>

      {/* Tracking timeline */}
      <div className="mb-12 relative flex flex-col items-start">
        {/* Background line */}
        <div className="absolute left-5 top-0 w-1 h-full bg-gray-200 dark:bg-gray-700 z-0">
          {/* Filled progress */}
          <div
            className="bg-green-500 w-1 transition-all duration-500"
            style={{
              height: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index <= currentStepIndex;

          return (
            <div
              key={step.label}
              className="relative z-10 flex items-center mb-8 last:mb-0"
            >
              {/* Step circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${
                  isActive
                    ? "bg-green-500 text-white border-transparent"
                    : "bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-600 text-gray-400"
                }`}
              >
                <StepIcon className="w-5 h-5" />
              </div>

              {/* Label */}
              <p
                className={`ml-3 text-sm font-medium ${
                  isActive ? "text-[#c9812f]" : "text-gray-500"
                }`}
              >
                {step.label.replaceAll("_", " ")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        {!nonCancellableStatuses.includes(order.orderStatus) && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-6 py-2 hover:bg-red-500 border border-black dark:border-gray-300 dark:text-white text-black hover:text-white cursor-pointer rounded-lg  transition"
          >
            Cancel Order
          </button>
        )}

        {order.orderStatus === "Delivered" &&
          order.products.some((p) => isReturnable(p)) && (
            <button
              onClick={() => setShowReturnModal(true)}
              className="px-6 py-2 border border-gray-400 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
            >
              Return Order
            </button>
          )}

        <button
          onClick={() => navigate("/products")}
          className="px-6 py-2 bg-gradient-to-r cursor-pointer from-[#c9812f] to-blue-500 text-white rounded-lg shadow hover:opacity-90 transition"
        >
          Buy More
        </button>
      </div>

      {showCancelModal && (
        <CancelOrderModal
          orderId={order.id}
          totalAmount={order.totalAmount}
          products={order.products}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleConfirmCancel}
        />
      )}

      {showReturnModal && (
        <ReturnOrderModal
          orderId={order.id}
          products={order.products}
          onClose={() => setShowReturnModal(false)}
          onConfirm={handleReturnOrder}
        />
      )}
    </div>
  );
};

export default TrackOrder;
