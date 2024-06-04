import axios from "axios"
import {users, pictures} from "./list-artist.js";



async function signup(user) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, user, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.log(`Error: ${error.response.data.message}`);
    } else {
      console.log(`Error: ${error.message}`);
    }
  }
}

async function main() {
  let index = 0;
  for (const user of users) {
    user.groupName = "";
    user.artistMembers = [];
    user.picture = pictures[index]
    await signup(user);
    index ++
  }
}

main();
