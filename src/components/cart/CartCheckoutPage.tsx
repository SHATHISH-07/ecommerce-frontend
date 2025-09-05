import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { PLACE_ORDER_FROM_CART } from "../../graphql/mutations/order";
import { GET_USER_CART } from "../../graphql/queries/cart.query";
import { GET_PRODUCTS_BY_IDS } from "../../graphql/queries/products.query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";
import type {
  PlaceOrderFromCartResponse,
  ShippingAddress,
} from "../../types/order";
import type { PaymentMethod } from "../order/PlaceOrderForm";
import { useAppToast } from "../../utils/useAppToast";
import { ShoppingCart } from "lucide-react";

const CartCheckoutPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const { toastSuccess, toastError } = useAppToast();

  const { data: cartData } = useQuery(GET_USER_CART, {
    fetchPolicy: "network-only",
    skip: !user,
  });

  const cart = cartData?.getUserCart;
  const cartProducts = useMemo(() => cart?.products ?? [], [cart?.products]);

  const { data: productsData } = useQuery(GET_PRODUCTS_BY_IDS, {
    variables: {
      ids: cartProducts.map((p: { productId: number }) => p.productId),
    },
    skip: cartProducts.length === 0,
  });

  const mergedProducts = useMemo(() => {
    if (!productsData?.getProductsByIds) return [];
    return cartProducts.map(
      (cartItem: { productId: number; quantity: number }) => {
        const product = productsData.getProductsByIds.find(
          (p: { id: number }) => p.id === cartItem.productId
        );
        return {
          ...product,
          quantity: cartItem.quantity,
          totalPrice: (product?.price || 0) * cartItem.quantity,
        };
      }
    );
  }, [cartProducts, productsData]);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
    country: user?.country || "",
    isVerified: false,
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Cash_on_Delivery");

  const [placeOrderFromCart, { loading }] =
    useMutation<PlaceOrderFromCartResponse>(PLACE_ORDER_FROM_CART);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) return;

    if (!user.emailVerified) {
      toastError(
        "Please verify your email in your profile before placing an order."
      );
      return;
    }

    try {
      const { data } = await placeOrderFromCart({
        variables: {
          paymentMethod,
          shippingAddress,
        },
      });

      if (data?.placeOrderFromCart?.success) {
        localStorage.setItem("orderEmail", shippingAddress.email);
        navigate("/verify-order-otp", {
          state: { email: shippingAddress.email },
        });
        toastSuccess("Order placed successfully!");
      } else {
        toastError(data?.placeOrderFromCart?.message || "Order failed");
      }
    } catch (err) {
      console.error(err);
      toastError("Error placing order from cart");
    }
  };

  const totalAmount = mergedProducts.reduce(
    (acc: number, item: { totalPrice: number }) => acc + item.totalPrice,
    0
  );

  if (cartProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-300">
          <ShoppingCart size={32} color="#c9812f" />
        </div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Your Cart is Empty
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Looks like you haven’t added any items yet.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-[#c9812f] to-blue-500 text-white rounded-lg shadow hover:opacity-90 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-black p-6 rounded-lg signup-shadow max-w-3xl w-full space-y-5"
      >
        <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-300">
          Checkout
        </h2>

        {/* Cart Items Summary */}
        <div className="space-y-4">
          {mergedProducts.map(
            (item: {
              id: number;
              title: string;
              price: number;
              quantity: number;
              totalPrice: number;
            }) => (
              <div
                key={item.id}
                className="flex justify-between border-b pb-2 text-gray-700 dark:text-gray-300"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>
                <p>
                  ₹{item.price} × {item.quantity} ={" "}
                  <span className="font-semibold">
                    ₹{item.totalPrice.toFixed(2)}
                  </span>
                </p>
              </div>
            )
          )}
          <div className="text-right font-bold text-lg">
            Total: ₹{totalAmount.toFixed(2)}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              "name",
              "email",
              "phone",
              "address",
              "city",
              "state",
              "zipCode",
              "country",
            ] as (keyof Omit<ShippingAddress, "isVerified">)[]
          ).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="font-medium capitalize text-gray-600 dark:text-gray-400">
                {key}
              </label>
              <input
                type="text"
                value={shippingAddress[key] || ""}
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

        {/* Payment Method */}
        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black"
          >
            <option value="Cash_on_Delivery">Cash on Delivery</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="NetBanking">Net Banking</option>
          </select>
        </div>

        {/* Mocked Inputs for Payment Details */}
        {paymentMethod === "Card" && (
          <div className="space-y-3 mt-3">
            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 dark:text-gray-400">
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-400">CVV</label>
                <input
                  type="password"
                  placeholder="***"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "UPI" && (
          <div className="mt-3">
            <label className="text-gray-600 dark:text-gray-400">UPI ID</label>
            <input
              type="text"
              placeholder="example@upi"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {paymentMethod === "NetBanking" && (
          <div className="mt-3">
            <label className="text-gray-600 dark:text-gray-400">Bank</label>
            <select className="w-full border bg-white dark:bg-black border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Bank</option>
              <option value="SBI">State Bank of India</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="AXIS">Axis Bank</option>
            </select>
          </div>
        )}

        {/* Place Order Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-2 font-semibold border bg-gradient-to-r from-[#c9812f] to-blue-500 border-gray-300 text-white rounded cursor-pointer"
        >
          {loading ? "Placing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CartCheckoutPage;
