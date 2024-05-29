import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

//import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
  return (
    <div className="App">
      <Navbar />
      <IsAnon> <Signup /> </IsAnon>
      {/* <IsAnon> <Login/> </IsAnon> */}

      <Routes>      
        
      </Routes>

    </div>
  );
}

export default App;