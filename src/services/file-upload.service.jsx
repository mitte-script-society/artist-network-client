import axios from "axios";

const api = axios.create({baseURL: "http://localhost:5005/"
  // withCredentials: true // => you might need this option if using cookies and sessions
});
const errorHandler = (err) => {
  throw err;
};
const uploadImage = (file) => {
  console.log("We will make the axios request from uploadImage, in services")
  return api.post("/auth/upload", file)
    .then(res => res.data)
    .catch(errorHandler);
};

export default uploadImage;
