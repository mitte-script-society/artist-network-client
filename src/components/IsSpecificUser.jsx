import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate, useParams } from "react-router-dom";

/*
Assuming that we have a property in the user model called: concertsHosted (an array of Id concerts)
Pros: From the user info we can check if the idConcert we want to edit belongs to the user
Cons: every time we create a concert, we have to send a put request to modify the user info.
*/

export default function IsSpecificUser( {children}) {
  const {concertId} = useParams()

  const { isLoading, user } = useContext(AuthContext);

  // If the authentication is still loading 
  if (isLoading) return <p>Loading ...</p>;

  if ( ! user.concertsHosted.some( concertHosted => concertHosted === concertId ) ) {
    // If it is not true that one concert hosted by the user matches the concert we want to edit...     
    //... we send back to home: 
    return <Navigate to="/" />;
  } else {
    // If one concert hosted by the user matches the concertId, then we render the children:
    return children;
  }
}