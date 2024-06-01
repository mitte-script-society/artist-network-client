import axios from "axios"
import users from "./list-artist.js";

async function signup(user) {
  console.log(users)
  try {
    const response = await axios.post('http://localhost:5005/auth/signup', user, {
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
  for (const user of users) {
    await signup(user);
  }
}

main();
