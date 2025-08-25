import { Navigate, Route, Routes } from "react-router-dom";
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
import OrderDetails from "./pages/userPages/OrderDetails";
import Products from "./pages/userPages/Products";
import ProductDetails from "./pages/userPages/ProductDetails";
import Categories from "./pages/userPages/Categories";
import ProductsByCategory from "./pages/userPages/ProductsByCategory";
import NotFound from "./pages/userPages/NotFound";

import AdminDashboard from "./pages/adminPages/AdminDashboard";

const App = () => {
  const { user, loading } = useAuth();

  if (loading)
    return <div className="h-screen flex justify-center items-center">...</div>;

  if (user?.role === "admin") {
    return (
      <>
        <NavBar />
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />}></Route>
        <Route path="/products" element={<Products />}></Route>
        <Route path="/products/:id" element={<ProductDetails />}></Route>
        <Route path="/categories" element={<Categories />}></Route>
        <Route
          path="/categories/:categorySlug"
          element={<ProductsByCategory />}
        />

        {/* Guest Routes */}
        <Route element={<GuestRoute />}>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/verify-email" element={<VerifyEmail />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orderDetails" element={<OrderDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
