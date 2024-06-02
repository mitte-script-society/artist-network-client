import "../styles/Login.css"
import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import closebutton from "../assets/closebutton.png"

const API_URL = "http://localhost:5005";

function Login( ) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { storeToken, authenticateUser, isLoggedIn, setIsLogInWindow, routePostLogin, setRoutePostLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsLogInWindow(false)
  }
  
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };
    
    // added async and await so authenticate changes the variables before redirecting to /user
    axios.post(`${API_URL}/auth/login`, requestBody)
    .then(async (response) => {
      storeToken(response.data.authToken);
      await authenticateUser();
      console.log("authentication completed");
      console.log("is logged in desde Login después de autenticación", isLoggedIn)
      console.log("going to:", routePostLogin)
      setIsLogInWindow(false);
      if (routePostLogin !== "") {
        navigate(routePostLogin);
      }
      setRoutePostLogin("") // => reset the value to ""
      return

    })
     .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
  <div className="fixed-background-windows">
    <div className="LoginSpace">
      <div className="flex min-h-full flex-col justify-center lg:px-12">
       
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img onClick={handleClose} className="mx-auto h-10 w-auto cursor-pointer" src={closebutton} alt="close"/>
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Log in</h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <div className="mt-2"> 
                <input id="email" name="email" type="email" onChange={handleEmail} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                </div> */}
              </div>
              <div className="mt-2">
                <input type="password" name="password" value={password} onChange={handlePassword} required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
              </div>
            </div>

            <div>
              <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <Link to="/signup" onClick={ () => setIsLogInWindow(false)} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Sign up</Link>
          </p>
        </div>
      </div>
    </div>
      
    </div>
  );
}

export default Login;