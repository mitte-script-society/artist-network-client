import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import IsPrivate from "./components/IsPrivate";
import User from "./pages/User";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./pages/Signup";
import BookConcert from "./pages/BookConcert";
import EditConcert from "./pages/EditConcert";
import SeeArtists from "./pages/SeeArtists";
import { useContext } from "react";
import { AuthContext } from "./context/auth.context";
import EditUser from "./pages/EditUser";
import NotFound from "./pages/NotFound";
import ArtistDetail from "./pages/ArtistDetail";
import About from "./pages/About";


function App() {
  //Aquí llamo a LogIn
  const { isLogInWindow} = useContext(AuthContext);

  return (
    <div className="App">
      <Navbar />
      
      {isLogInWindow && <Login/>}

      <Routes>      
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/see-artists" element={<SeeArtists/>} />
        <Route path="/see-artists/:artistId" element={<ArtistDetail/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/edit-user/" element={<IsPrivate> <EditUser/> </IsPrivate>} />
        <Route path="/concerts/book/:artistId" element={<IsPrivate><BookConcert/></IsPrivate>} />
        <Route path="/concerts/edit/:concertId" element={<IsPrivate><EditConcert/></IsPrivate>} />
        <Route path="/user" element={<IsPrivate> <User/> </IsPrivate>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>

    </div>
  );
}

export default App;