import { useEffect, useState } from "react";
import { useAppToast } from "../../utils/useAppToast";

interface ProductSummary {
  externalProductId: number;
  title: string;
  thumbnail: string;
  priceAtPurchase: number;
  quantity: number;
}

interface CancelOrderModalProps {
  orderId: string;
  totalAmount: number;
  products: ProductSummary[];
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  orderId,
  totalAmount,
  products,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const { toastError } = useAppToast();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toastError("Please provide a reason for cancellation.");
      return;
    }

    try {
      setLoading(true);
      await onConfirm(reason);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-300/80 dark:bg-[#2a2a2a]/90 z-50">
      <div className="bg-white dark:bg-black p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">Cancel Order</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Order ID: <span className="font-medium">{orderId}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Total Amount: ₹{totalAmount}
        </p>

        {products.map((p) => (
          <div
            key={p.externalProductId}
            className="flex items-center gap-3 last:border-b-0 py-2 dark:border-gray-700"
          >
            <img
              src={p.thumbnail}
              alt={p.title}
              className="w-12 h-12 object-cover rounded-md"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {p.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ₹{p.priceAtPurchase} × {p.quantity}
              </p>
            </div>
          </div>
        ))}

        {/* Reason input */}
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border rounded-lg p-2 dark:bg-[#1a1a1a] dark:border-gray-500"
          rows={3}
          placeholder="Enter reason for cancellation..."
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 cursor-pointer border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 cursor-pointer bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
