import axios from "axios";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";

function App() {
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="text-center mt-100">
      <AuthProvider>
        <h1 className="text-4xl font-bold text-red-500">
          BMW Ecommerce Frontend is Working 🚀
        </h1>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
