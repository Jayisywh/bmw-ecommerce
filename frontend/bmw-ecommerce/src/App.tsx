import axios from "axios";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="text-center mt-100">
      <h1 className="text-4xl font-bold text-red-500">
        BMW Ecommerce Frontend is Working 🚀
      </h1>
    </div>
  );
}

export default App;
