import axios from "axios";

const api = axios.create({baseURL: "http://localhost:5005/"
  // withCredentials: true // => you might need this option if using cookies and sessions
});

const errorHandler = (err) => {
  throw err;
};

const uploadImage = (file) => {
  return api.post("/auth/upload", file)
    .then(res => res.data)
    .catch(errorHandler);
};

export default uploadImage;

/*
Tengo un programa que simula subir imágenes a cloudinary y los usuarios. 
¿Para qué? 
Si necesitamos reconstruir la base de datos, sólo modificamos el archivo con las variables. 



*/