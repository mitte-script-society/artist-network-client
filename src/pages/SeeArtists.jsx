import { useState } from "react";
import DisplayArtists from "../components/DisplayArtists";
import Login from '../components/Login'


export default function SeeArtists() {
  const [showLogIn, setShowLogIn] = useState(false);
  

  return ( 
    <>
      {showLogIn && 
      <Login turnOff={setShowLogIn}/>
      }

      <h1>See all artists</h1>
      <DisplayArtists setShowLogIn={setShowLogIn}/>
    </>

  )
}