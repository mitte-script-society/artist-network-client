import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/auth.context";

function Navbar({showAlert, changeInNotifications}) {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, userInformation, logOutUser, setIsLogInWindow } = useContext(AuthContext);
  const [displayAlert, setDisplayAlert] = useState("none")
  const [totalNotifications, setTotalNotifications] = useState(null); 

  useEffect( () => {
    if (isLoggedIn === true){
    console.log("Executing in nabvar")
    let total = 0;
    for (let origin in userInformation.notifications) {
      if (userInformation.notifications.hasOwnProperty(origin)) {
        total += userInformation.notifications[origin].quantity;
      }
    }
    setTotalNotifications(total)
  }
  }, [changeInNotifications, userInformation.notifications])

  const [hideMobileMenu, setHideMobileMenu] = useState(true)

  const handleToggle = (e) => {
    setHideMobileMenu(!hideMobileMenu)
  }


  useEffect(() => {
    if (showAlert === true) setDisplayAlert("red")
    if (showAlert === false) setDisplayAlert("none")
  }, [showAlert])

  const handleCallLogin = () => {
    setIsLogInWindow(true);
  }

  return (
    <nav style={{ position: "sticky", top: "0", zIndex: "1" }} className="bg-gray-800">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button type="button" onClick={handleToggle} className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {/* <!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          --> */}
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              {/* <!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          --> */}
              <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">

              {/* <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" /> */}
              <span className="ml-2 text-md text-white font-bold">Artist Connection</span>

            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-pink-800 text-white rounded-md px-3 py-2 text-sm font-medium"
                      : "text-gray-300 hover:bg-pink-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  }
                  aria-current="page">Find Concerts
                </NavLink>

                <NavLink to="/see-artists" className={({ isActive }) =>
                  isActive ? "bg-pink-800 text-white rounded-md px-3 py-2 text-sm font-medium"
                    : "text-gray-300 hover:bg-pink-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                }>Find Artists </NavLink>


                {!isLoggedIn ? //Display either About-Log in-Sign Up or My Dashboard  
                  <>

                    <NavLink onClick={handleCallLogin}
                      className="text-gray-300 hover:bg-pink-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                      Log In
                    </NavLink>

                    <NavLink to="/signup" className={({ isActive }) =>
                      isActive ? "bg-pink-800 text-white rounded-md px-3 py-2 text-sm font-medium"
                        : "text-gray-300 hover:bg-pink-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    }> Sign Up </NavLink>

                  </>
                  :
                  <>
                    <NavLink to="/user" className={({ isActive }) =>
                      isActive ? "bg-pink-800 text-white rounded-md px-3 py-2 text-sm font-medium"
                        : "text-gray-300 hover:bg-pink-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    }>My Dashboard</NavLink>

        <NavLink to="/chat" className={({ isActive }) =>
            isActive ? "bg-pink-800 text-white rounded-md px-3 py-2 text-sm font-medium"
                      : "text-gray-300 hover:bg-pink-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
         }
        style={{position:"relative"}}
        >Chat
        { totalNotifications > 0 && <div className="nav-notifications-number">{totalNotifications}</div>}
        </NavLink>        
        
        </>
        

                }
              </div>
            </div>
          </div>

          {isLoggedIn &&
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

              <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill={displayAlert} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>

              {/* <!-- Profile dropdown --> */}
              <div className="relative ml-3">
                <div>
                  <button onClick={() => { document.getElementById("xxxx").classList.toggle("hidden") }} type="button" className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <img className="h-8 w-8 rounded-full" src={userInformation.picture} alt="user picture" />
                  </button>
                </div>

                {/* <!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          --> */}
                <div id="xxxx" className="hidden absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                  {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                  <NavLink to="/edit-user" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200" role="menuitem" tabIndex="-1" id="user-menu-item-0" onClick={() => { document.getElementById("xxxx").classList.toggle("hidden") }}>Edit Profile</NavLink>
                  {/*                 <a href="" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200" role="menuitem" tabIndex="-1" id="user-menu-item-1">Settings</a>
 */}                <a href="" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200" role="menuitem" tabIndex="-1" id="user-menu-item-2" onClick={logOutUser}>Sign out</a>
                </div>
              </div>

            </div>

          }
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      <div className={`${hideMobileMenu && 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
          <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-pink-800 text-white block rounded-md px-3 py-2 text-base font-medium"
                      : "text-gray-300 hover:bg-pink-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                  }
                  aria-current="page">Find Concerts
          </NavLink>
          <NavLink to="/see-artists" className={({ isActive }) =>
                  isActive ? "bg-pink-800 text-white block rounded-md px-3 py-2 text-base font-medium"
                    : "text-gray-300 hover:bg-pink-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                }>Find Artists
          </NavLink>
          {!isLoggedIn && //Display either About-Log in-Sign Up or My Dashboard  
                  <>
          <NavLink onClick={handleCallLogin}
            className="text-gray-300 hover:bg-pink-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
            Log In
          </NavLink>

          <NavLink to="/signup" className={({ isActive }) =>
            isActive ? "bg-pink-800 text-white block rounded-md px-3 py-2 text-base font-medium"
              : "text-gray-300 hover:bg-pink-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
          }> Sign Up </NavLink>
        </>}
        {isLoggedIn &&
        <>
          <NavLink to="/user" className={({ isActive }) =>
            isActive ? "bg-pink-800 text-white block rounded-md px-3 py-2 text-base font-medium"
              : "text-gray-300 hover:bg-pink-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
          }>My Dashboard</NavLink>

          {/* <NavLink to="/chat" className={({ isActive }) =>
            isActive ? "bg-pink-800 text-white block rounded-md px-3 py-2 text-base font-medium"
              : "text-gray-300 hover:bg-pink-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
          }>Chat</NavLink> */}
        </>
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;