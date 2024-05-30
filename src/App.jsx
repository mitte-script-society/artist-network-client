import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import IsPrivate from "./components/IsPrivate";
import User from "./pages/User";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <Navbar />
    
      <Routes>      
        <Route path="/" element={<Home/>} />
        <Route path="/user" element={<IsPrivate> <User/> </IsPrivate>} />
      </Routes>

    </div>
  );
}

export default App;