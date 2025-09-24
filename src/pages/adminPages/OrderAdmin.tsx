import { useState } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  INITIATE_REFUND,
  UPDATE_USER_ORDER_STATUS,
} from "../../graphql/mutations/order";
import {
  GET_ALL_ORDERS,
  GET_USER_ORDER_BY_STATUS,
  GET_USER_ORDER_BY_ID,
} from "../../graphql/queries/userOrder.query";
import LoadingSpinner from "../../components/products/LoadingSpinner";
import { useAppToast } from "../../utils/useAppToast";

type Mode = "all" | "status" | "id";

interface OrderProduct {
  externalProductId: number;
  title: string;
  thumbnail: string;
  quantity: number;
}

interface UserOrder {
  id: string;
  userId: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
}

const OrderAdmin = () => {
  const [page, setPage] = useState(1);
  const [pageBlock, setPageBlock] = useState(0);
  const [searchId, setSearchId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [mode, setMode] = useState<Mode>("all");

  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [processingRefund, setProcessingRefund] = useState<string | null>(null);

  const limit = 10;
  const pagesPerBlock = 10;
  const skip = (page - 1) * limit;

  const { toastSuccess, toastError } = useAppToast();

  // Queries
  const { data, loading, error, refetch } = useQuery(GET_ALL_ORDERS, {
    fetchPolicy: "network-only",
    variables: { limit, skip },
  });

  const [
    getByStatus,
    { data: statusData, loading: statusLoading, refetch: refetchByStatus },
  ] = useLazyQuery(GET_USER_ORDER_BY_STATUS, { fetchPolicy: "network-only" });

  const [getById, { data: idData, loading: idLoading, refetch: refetchById }] =
    useLazyQuery(GET_USER_ORDER_BY_ID, { fetchPolicy: "network-only" });

  // Mutations
  const [updateStatus] = useMutation(UPDATE_USER_ORDER_STATUS);
  const [initiateRefund] = useMutation(INITIATE_REFUND);

  // Derived orders
  const orders: UserOrder[] =
    mode === "status"
      ? statusData?.getAllOrderByStatusAdmin ?? []
      : mode === "id"
      ? idData?.getOrderById
        ? [idData.getOrderById]
        : []
      : data?.getAllOrdersAdmin ?? [];

  const total =
    mode === "status"
      ? statusData?.getAllOrderByStatusAdmin?.length ?? 0
      : mode === "id"
      ? idData?.getOrderById
        ? 1
        : 0
      : data?.getAllOrdersAdmin?.length ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Actions
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!newStatus) return;
    setUpdatingStatus(orderId);
    try {
      await updateStatus({ variables: { orderId, newStatus } });
      toastSuccess("Order status updated!");
      if (mode === "status") {
        refetchByStatus?.({ status: selectedStatus });
      } else {
        refetch();
      }
    } catch (err) {
      console.error(err);
      toastError("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleInitiateOrConfirmRefund = async (orderId: string) => {
    setProcessingRefund(orderId);
    try {
      const { data } = await initiateRefund({ variables: { orderId } });
      toastSuccess(data.initiateOrConfirmRefundOrder.message);
      if (mode === "status") {
        refetchByStatus?.({ status: selectedStatus });
      } else {
        refetch();
      }
    } catch (err) {
      console.error(err);
      toastError("Failed to process refund");
    } finally {
      setProcessingRefund(null);
    }
  };

  // Search & filters
  const handleSearchById = async () => {
    if (!searchId.trim()) return;
    setMode("id");
    if (idData && typeof refetchById === "function") {
      await refetchById({ orderId: searchId });
    } else {
      await getById({ variables: { orderId: searchId } });
    }
  };

  const handleFilterByStatus = async (status: string) => {
    if (status === "ALL") {
      setMode("all");
      setSelectedStatus("ALL");
      await refetch();
      return;
    }
    setSelectedStatus(status);
    setMode("status");
    await getByStatus({ variables: { status } });
  };

  const handleReset = async () => {
    setSearchId("");
    setSelectedStatus("ALL");
    setMode("all");
    setPage(1);
    setPageBlock(0);
    await refetch();
  };

  // Pagination
  const startPage = pageBlock * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);
  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, i) => startPage + i
  );

  const isLoading =
    (mode === "all" && loading) ||
    (mode === "id" && idLoading) ||
    (mode === "status" && statusLoading);

  if (isLoading && !orders.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by Order ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchById()}
            className="border px-3 py-2 rounded w-60"
          />
          <button
            onClick={handleSearchById}
            className="border border-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded"
          >
            Get by ID
          </button>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => handleFilterByStatus(e.target.value)}
            className="border rounded px-3 py-2 bg-gray-50 dark:bg-[#242424] cursor-pointer"
          >
            <option value="ALL">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out_for_Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        <button
          onClick={handleReset}
          className="border border-gray-500 hover:bg-gray-500 hover:text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-[#242424]">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Products</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: UserOrder) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50 dark:hover:bg-[#242424]"
              >
                <td className="p-3 font-medium">{order.id}</td>
                <td className="p-3">{order.userId}</td>
                <td className="p-3">
                  {order.products.map((p) => (
                    <div
                      key={p.externalProductId}
                      className="flex items-center gap-2 mb-1"
                    >
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="text-sm">
                        {p.title} (x{p.quantity})
                      </span>
                    </div>
                  ))}
                </td>
                <td className="p-3 font-bold">₹{order.totalAmount}</td>
                <td className="p-3">
                  {order.paymentMethod} ({order.paymentStatus})
                </td>
                <td className="p-3">{order.orderStatus}</td>
                <td className="p-3 flex flex-col gap-2 ">
                  <select
                    className="border rounded px-2 py-1 cursor-pointer bg-gray-50 dark:bg-[#242424]"
                    onChange={(e) =>
                      handleUpdateStatus(order.id, e.target.value)
                    }
                    disabled={updatingStatus === order.id}
                  >
                    <option value="">Update Status</option>
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out_for_Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                  {updatingStatus === order.id && (
                    <span className="text-sm text-gray-500">Updating...</span>
                  )}

                  {(order.orderStatus === "Cancelled" ||
                    order.orderStatus === "Returned") && (
                    <button
                      onClick={() => handleInitiateOrConfirmRefund(order.id)}
                      className="px-3 py-1 border rounded bg-red-500 text-white hover:bg-red-600"
                      disabled={processingRefund === order.id}
                    >
                      {processingRefund === order.id
                        ? "Processing..."
                        : "Initiate Refund"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {mode === "all" && (
        <div className="flex justify-center mt-6 gap-2">
          {pageBlock > 0 && (
            <button
              onClick={() => setPageBlock(pageBlock - 1)}
              className="px-3 py-1 rounded border bg-gray-200 hover:bg-gray-300"
            >
              &lt; Prev 10
            </button>
          )}
          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded border ${
                page === p
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
          {endPage < totalPages && (
            <button
              onClick={() => setPageBlock(pageBlock + 1)}
              className="px-3 py-1 rounded border bg-gray-200 hover:bg-gray-300"
            >
              Next 10 &gt;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderAdmin;
