import { useState } from "react";
import { useMutation } from "@apollo/client";
import { PLACE_ORDER } from "../graphql/mutations/order";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useAppToast } from "../utils/useAppToast";

export type PaymentMethod = "Cash_on_Delivery" | "Card" | "UPI" | "NetBanking";

interface Product {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  returnPolicy: string;
}

interface UserAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const products: Product[] = location.state?.products || [];
  const user = useSelector((state: RootState) => state.user.user);

  const { toastSuccess, toastError } = useAppToast();

  const [shippingAddress, setShippingAddress] = useState<UserAddress>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
    country: user?.country || "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Cash_on_Delivery");

  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [netBanking, setNetBanking] = useState({
    bankName: "",
    accountNumber: "",
  });

  const [placeOrder, { loading }] = useMutation(PLACE_ORDER);

  const totalAmount = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    if (!user.emailVerified) {
      toastError(
        "Please verify your email in your profile before placing an order."
      );
      return;
    }

    localStorage.setItem("orderEmail", user.email);

    const productsInput = products.map((p) => ({
      externalProductId: p.id,
      title: p.title,
      thumbnail: p.thumbnail,
      priceAtPurchase: p.price,
      quantity: p.quantity,
      totalPrice: p.price * p.quantity,
      returnPolicy: p.returnPolicy,
    }));

    try {
      const { data } = await placeOrder({
        variables: {
          input: {
            products: productsInput,
            shippingAddress,
            paymentMethod,
            totalAmount,
          },
        },
      });

      if (data?.placeOrder?.success) {
        toastSuccess("Order placed successfully");
        navigate("/verify-order-otp", {
          state: { email: shippingAddress.email },
        });
      } else {
        toastError(data?.placeOrder?.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      toastError("Error placing order");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white dark:bg-black p-6 rounded-lg signup-shadow w-full max-w-4xl">
        <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-300 mb-6">
          Confirm Your Order
        </h2>

        {/* Product Summary */}
        <div className="space-y-2 mb-6">
          <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">
            Product Summary
          </h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg dark:bg-[#1f1f1f]"
              >
                {p.thumbnail && (
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {p.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Price: ₹{p.price} × {p.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  ₹{(p.price * p.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center font-semibold text-lg text-gray-700 dark:text-gray-300 mt-3">
            <span>Total:</span>
            <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Shipping Address */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">
              Shipping Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(shippingAddress).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="font-medium capitalize text-gray-600 dark:text-gray-400">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        [key]: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">
              Payment Method
            </h3>
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as PaymentMethod)
              }
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black "
            >
              <option value="Cash_on_Delivery">Cash on Delivery</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="NetBanking">Net Banking</option>
            </select>

            {/* UPI ID Input */}
            {paymentMethod === "UPI" && (
              <div className="mt-3">
                <label className="font-medium text-gray-600 dark:text-gray-400">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@upi"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Card Details Input */}
            {paymentMethod === "Card" && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="font-medium text-gray-600 dark:text-gray-400">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardNumber: e.target.value,
                      })
                    }
                    placeholder="1234 5678 9012 3456"
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-gray-600 dark:text-gray-400">
                      Expiry
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expiry: e.target.value,
                        })
                      }
                      placeholder="MM/YY"
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-600 dark:text-gray-400">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                      placeholder="123"
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking Input */}
            {paymentMethod === "NetBanking" && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="font-medium text-gray-600 dark:text-gray-400">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={netBanking.bankName}
                    onChange={(e) =>
                      setNetBanking({ ...netBanking, bankName: e.target.value })
                    }
                    placeholder="Bank Name"
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-600 dark:text-gray-400">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={netBanking.accountNumber}
                    onChange={(e) =>
                      setNetBanking({
                        ...netBanking,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="XXXXXXXXXXXX"
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="font-semibold text-lg text-gray-700 dark:text-gray-300">
              Total:{" "}
              <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
            </p>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 font-semibold border bg-gradient-to-r from-[#c9812f] to-blue-500 border-gray-300 text-white rounded cursor-pointer"
            >
              {loading ? "Placing..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
