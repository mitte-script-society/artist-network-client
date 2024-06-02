//Here we handle all requests to user-routes in backend: 
import axios from "axios";
const API_URL = "http://localhost:5005";

export function  bookmarkUser( action, userId, property, newElement ) {
  const body = {action, userId, property, newElement}
  return axios.put(`${API_URL}/user/bookmark`, body)
}