//Here we handle all requests to user-routes in backend: 
import axios from "axios";


export function  bookmarkUser( action, userId, property, newElement ) {
  const body = {action, userId, property, newElement}
  return axios.put(`${import.meta.env.VITE_API_URL}/user/bookmark`, body)
}