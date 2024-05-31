import { useState } from "react";
import DisplayArtists from "../components/DisplayArtists";
import Login from '../components/Login'
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";

export default function SeeArtists() {

  const { isLogInWindow  } = useContext(AuthContext);

 

  return ( 
    <>
      {isLogInWindow && 
      <Login />
      }

      <h1>See all artists</h1>
      <DisplayArtists />
    </>

  )
}