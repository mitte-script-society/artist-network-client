import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import IsPrivate from "./components/IsPrivate";
import User from "./pages/User";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookConcert from "./pages/BookConcert";
import SeeArtists from "./pages/SeeArtists";

function App() {
  return (
    <div className="App">
      <Navbar />
    
      <Routes>      
        <Route path="/" element={<Home/>} />
        <Route path="/see-artists" element={<SeeArtists/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/concerts/book" element={<BookConcert/>} />
        <Route path="/user" element={<IsPrivate> <User/> </IsPrivate>} />
      </Routes>

    </div>
  );
}

export default App;