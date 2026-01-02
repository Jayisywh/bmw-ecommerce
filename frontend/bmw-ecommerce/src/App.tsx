import axios from "axios";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Models from "./pages/Models";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppWrapper } from "./components/AppWrapper";
import { WishlistProvider } from "./contexts/WishlistContext";
import Wishlist from "./pages/Wishlist";
import { ToastContainer } from "react-toastify";
import Cart from "./pages/Cart";
import CarDetail from "./pages/CarDetail";
import { CartProvider } from "./contexts/CartContext";
import Compare from "./pages/Compare";
import Configure from "./pages/Configure";

function App() {
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <AuthProvider>
      <ThemeProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <AppWrapper>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/" element={<Home />}></Route>
                  <Route path="/models" element={<Models />} />
                  <Route path="/models/:id" element={<CarDetail />}></Route>
                  <Route path="/configure" element={<Configure />}></Route>
                  <Route path="/configure/:id" element={<Configure />}></Route>
                  <Route path="/compare" element={<Compare />}></Route>
                  <Route path="/wishlist" element={<Wishlist />}></Route>
                  <Route path="/cart" element={<Cart />}></Route>
                </Routes>
              </AppWrapper>
              <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="dark"
              />
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
