import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_ORDERS } from "../../graphql/queries/userOrder.query";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";
import type { CancelOrderResponse } from "../../types/order";
import CancelOrderModal from "../../components/CancelOrderModal";
import { CANCEL_ORDER, RETURN_ORDER } from "../../graphql/mutations/order";
import { useAppToast } from "../../utils/useAppToast";
import ReturnOrderModal from "../../components/ReturnOrderModal";

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
  deliveredAt: string;
}

const nonCancellableStatuses = ["Shipped", "Out_for_Delivery", "Delivered"];

const Orders = () => {
  const { data, loading, error, refetch } = useQuery(GET_USER_ORDERS, {
    fetchPolicy: "network-only",
  });

  const [cancelOrder] = useMutation<CancelOrderResponse>(CANCEL_ORDER);
  const [returnOrder] = useMutation(RETURN_ORDER);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    total: number;
    products: Product[];
  } | null>(null);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<{
    id: string;
    products: Product[];
  } | null>(null);

  const navigate = useNavigate();
  const { toastSuccess, toastError } = useAppToast();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load orders.</p>
      </div>
    );

  const orders: Order[] = data?.getAllUserOrder || [];

  const handleConfirmCancel = async (reason: string) => {
    if (!selectedOrder) return;
    try {
      const res = await cancelOrder({
        variables: {
          orderId: selectedOrder.id,
          reason,
        },
      });

      if (res.data?.cancelOrder.success) {
        toastSuccess(res.data.cancelOrder.message);
        refetch();
        setShowModal(false);
      } else {
        toastError(res.data?.cancelOrder.message || "Cancellation failed.");
      }
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Unexpected error occurred."
      );
    }
  };

  const isReturnable = (product: Product) => {
    if (!product.returnExpiresAt) return false;
    const expiry = new Date(product.returnExpiresAt);
    return new Date() <= expiry;
  };

  const handleReturnOrder = async (reason: string) => {
    if (!selectedReturnOrder) return;
    try {
      const res = await returnOrder({
        variables: {
          orderId: selectedReturnOrder.id,
          reason,
        },
        refetchQueries: [{ query: GET_USER_ORDERS }],
      });

      if (res.data?.returnOrder.success) {
        toastSuccess(res.data.returnOrder.message);
        refetch();
        setShowReturnModal(false);
      } else {
        toastError(res.data?.returnOrder.message || "Return failed.");
      }
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Unexpected error occurred."
      );
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
          <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-300">
            <ShoppingBasket size={32} color="#c9812f" />
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            No orders found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Looks like you haven’t placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-[#c9812f] to-blue-500 text-white rounded-lg shadow hover:opacity-90 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-6 text-center">My Orders</h2>
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition hover:shadow-md"
            >
              {/* Order header */}
              <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <p>
                  <span className="font-semibold">Order Status:</span>{" "}
                  {order.orderStatus}
                </p>
                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {order.paymentMethod} ({order.paymentStatus})
                </p>
                <p className="font-semibold text-lg">
                  Total: ₹{order.totalAmount}
                </p>
              </div>

              {/* Products + Actions */}
              <div className="px-4 md:px-6 py-4 flex flex-col lg:flex-row gap-6">
                {/* Product list */}
                <ul className="space-y-3 flex-1">
                  {order.products.map((product, index) => (
                    <li
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product.externalProductId}`);
                      }}
                      className="flex sm:flex-row flex-col items-center gap-4 border cursor-pointer rounded-lg p-3 bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700"
                    >
                      {product.thumbnail && (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-30 h-30 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Price: ₹{product.priceAtPurchase}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {product.quantity}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Action buttons */}
                <div className="flex flex-col justify-center gap-4 min-w-[200px]">
                  {order.orderStatus === "Cancelled" ? (
                    <p className="text-md text-center text-gray-600 dark:text-gray-400">
                      Refund will be processed
                    </p>
                  ) : order.orderStatus === "Returned" ? (
                    <div className="text-center">
                      <p className="text-lg text-gray-600 dark:text-green-400">
                        Your order has been returned.
                      </p>
                      <p className="text-md  text-gray-600 dark:text-gray-400">
                        The product will be received by us soon <br /> and the
                        refund will be initiated shortly
                      </p>
                    </div>
                  ) : order.orderStatus === "Delivered" ? (
                    <div className="text-md text-center">
                      <p className="text-green-600 dark:text-green-400">
                        Order Delivered on {order.deliveredAt.substring(0, 10)}
                      </p>

                      {order.products.map((p, i) => (
                        <div key={i} className="mt-2">
                          <p className="text-sm pb-2">{p.returnPolicy}</p>
                          {p.returnExpiresAt ? (
                            new Date(p.returnExpiresAt) < new Date() ? (
                              <p className="text-sm text-red-500">
                                Return window expired on{" "}
                                {new Date(p.returnExpiresAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            ) : (
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                Expires on{" "}
                                {new Date(p.returnExpiresAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            )
                          ) : (
                            <p className="text-sm text-red-500">
                              No return available
                            </p>
                          )}
                        </div>
                      ))}

                      {order.products.some(
                        (p) =>
                          isReturnable(p) &&
                          p.returnPolicy !== "No return policy"
                      ) && (
                        <button
                          className="mt-3 px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900 rounded-lg cursor-pointer"
                          onClick={() => {
                            setSelectedReturnOrder({
                              id: order.id,
                              products: order.products,
                            });
                            setShowReturnModal(true);
                          }}
                        >
                          Return Order
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {[
                        "Processing",
                        "Packed",
                        "Shipped",
                        "Out_for_Delivery",
                      ].includes(order.orderStatus) && (
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-[#c9812f] to-blue-500 text-white rounded-lg cursor-pointer"
                          onClick={() =>
                            navigate(`/product/track-order/${order.id}`)
                          }
                        >
                          Track Order
                        </button>
                      )}

                      {/* Show Cancel if not yet shipped/delivered */}
                      {!nonCancellableStatuses.includes(order.orderStatus) && (
                        <button
                          className="px-4 py-2 text-red-500 border border-gray-300 dark:border-gray-600 hover:bg-red-400 hover:text-white rounded-lg cursor-pointer"
                          onClick={() => {
                            setSelectedOrder({
                              id: order.id,
                              total: order.totalAmount,
                              products: order.products,
                            });
                            setShowModal(true);
                          }}
                        >
                          Cancel Order
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedOrder && (
        <CancelOrderModal
          orderId={selectedOrder.id}
          totalAmount={selectedOrder.total}
          products={selectedOrder.products}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmCancel}
        />
      )}

      {showReturnModal && selectedReturnOrder && (
        <ReturnOrderModal
          orderId={selectedReturnOrder.id}
          products={selectedReturnOrder.products}
          onClose={() => setShowReturnModal(false)}
          onConfirm={handleReturnOrder}
        />
      )}
    </div>
  );
};

export default Orders;
