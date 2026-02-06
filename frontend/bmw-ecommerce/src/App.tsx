import axios from "axios";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";

import { ToastContainer } from "react-toastify";

// Client pages
import Login from "./pages/client/Login";
import Signup from "./pages/client/Signup";
import Home from "./pages/client/Home";
import Models from "./pages/client/Models";
import CarDetail from "./pages/client/CarDetail";
import Configure from "./pages/client/Configure";
import Compare from "./pages/client/Compare";
import Wishlist from "./pages/client/Wishlist";
import Cart from "./pages/client/Cart";
import { Checkout } from "./pages/client/Checkout";
import OrderSuccess from "./pages/client/OrderSuccess";
import UserProfile from "./pages/client/UserProfile";

// Layouts
import ClientLayout from "./layout/client/ClientLayout";
import AdminLayout from "./layout/admin/AdminLayout";

// Admin pages & routes
import AdminRoutes from "./routes/admin/AdminRoutes";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import CarsManagement from "./pages/admin/CarManagement";
import OrdersManagement from "./pages/admin/OrderManagement";
import PaymentsManagement from "./pages/admin/PaymentManagement";
import Review from "./pages/client/Review";
import AdminReviews from "./pages/admin/AdminReviews";

function App() {
  // Test backend connection
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <WishlistProvider>
            <CartProvider>
              <Routes>
                {/* Client pages with navbar */}
                <Route path="/" element={<ClientLayout />}>
                  <Route index element={<Home />} />
                  <Route path="models" element={<Models />} />
                  <Route path="models/:id" element={<CarDetail />} />
                  <Route path="configure" element={<Configure />} />
                  <Route path="configure/:id" element={<Configure />} />
                  <Route path="compare" element={<Compare />} />
                  <Route path="userprofile" element={<UserProfile />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-success" element={<OrderSuccess />} />
                  <Route path="review" element={<Review />} />
                </Route>
                {/* Auth pages without navbar */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Admin pages with sidebar */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoutes>
                      <AdminLayout />
                    </AdminRoutes>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="cars" element={<CarsManagement />} />
                  <Route path="orders" element={<OrdersManagement />} />
                  <Route path="payments" element={<PaymentsManagement />} />
                  <Route path="reviews" element={<AdminReviews />} />
                </Route>
              </Routes>

              {/* Toast notifications */}
              <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="dark"
              />
            </CartProvider>
          </WishlistProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
