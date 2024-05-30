import { useContext } from 'react';
import { AuthContext } from "../context/auth.context";

const User = () => {
  const { user, logOutUser} = useContext(AuthContext);
  console.log(user)
  return (
    <div>
      <h1>Welcome {user?.email}</h1>
      <h1>With the email, we can retrieve the information of this specific user</h1>
      <button onClick={logOutUser}>Log out</button>
    </div>
  );
};

export default User;
