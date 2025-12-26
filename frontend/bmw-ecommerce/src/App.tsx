import axios from "axios";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Models from "./pages/Models";

function App() {
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/models" element={<Models />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
