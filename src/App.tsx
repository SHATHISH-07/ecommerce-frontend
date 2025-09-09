import { Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import NavBar from "./components/navbar/NavBar";
import Home from "./pages/userPages/Home";
import SignUp from "./pages/userPages/SignUp";
import Login from "./pages/userPages/Login";
import Footer from "./components/Footer";
import VerifyEmail from "./pages/userPages/VerifyEmailPage";
import ScrollToTop from "./utils/ScrollToTop";
import GuestRoute from "./routes/GuestRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Orders from "./pages/userPages/Orders";
import Profile from "./pages/userPages/Profile";
import Cart from "./pages/userPages/Cart";
import TrackOrder from "./pages/userPages/TrackOrder";
import Products from "./pages/userPages/Products";
import ProductDetails from "./pages/userPages/ProductDetails";
import Categories from "./pages/userPages/Categories";
import ProductsByCategory from "./pages/userPages/ProductsByCategory";
import NotFound from "./pages/userPages/NotFound";

import AdminDashboard from "./pages/adminPages/AdminDashboard";
import { Toaster } from "react-hot-toast";
import VerifyOrderPage from "./pages/userPages/VerifyOrderPage";
import PlaceOrderPage from "./components/order/PlaceOrderForm";
import CartCheckoutPage from "./components/cart/CartCheckoutPage";
import ForgetPassword from "./pages/userPages/ForgetPassword";
import PasswordVerify from "./pages/userPages/PasswordVerify";
import ChangePassword from "./pages/userPages/ChangePassword";
import LoadingSpinner from "./components/products/LoadingSpinner";
import AdminLayout from "./components/admin/AdminLayout";
import AllProducts from "./pages/adminPages/AllProducts";
import EditProduct from "./pages/adminPages/EditProduct";
import AddProduct from "./pages/adminPages/AddProduct";
import AddBulkProduct from "./pages/adminPages/AddBulkProduct";

const App = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  if (user?.role === "admin") {
    return (
      <>
        <AdminLayout>
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AllProducts />} />
            <Route path="/admin/products/edit/:id" element={<EditProduct />} />
            <Route path="/admin/products/new" element={<AddProduct />} />
            <Route
              path="/admin/products/new/bulk"
              element={<AddBulkProduct />}
            />
          </Routes>
        </AdminLayout>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="/categories/:categorySlug"
          element={<ProductsByCategory />}
        />

        {/* Guest Routes */}
        <Route element={<GuestRoute />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/reset-password-verify" element={<PasswordVerify />} />
          <Route path="/changePassword" element={<ChangePassword />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/track-order/:id" element={<TrackOrder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/verify-order-otp" element={<VerifyOrderPage />} />
          <Route path="/placeorder" element={<PlaceOrderPage />} />
          <Route path="/cart-checkout" element={<CartCheckoutPage />} />
        </Route>

        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toaster />
    </>
  );
};

export default App;
