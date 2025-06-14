import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/login";
import { useState } from "react";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />}></Route>
    </Routes>
  );
}

export default App;
