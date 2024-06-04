import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

function Comments() {

const { isLoggedIn, userInformation, } = useContext(AuthContext);

  const { artistId } = useParams();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/reference/${artistId}`)
      .then((response) => {
        setComments(response.data)
        console.log(response.data)
    })
      .catch((error) => console.error("Error fetching comments:", error));
  }, [artistId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        sender: userInformation._id,
        senderName: userInformation.name,
        receiver: artistId,
        content: comment,
        date: new Date()
      };
      console.log(newComment)
      const storedToken = localStorage.getItem("authToken");
      axios
        .post(`${import.meta.env.VITE_API_URL}/reference/`, newComment, 
        { headers: { Authorization: `Bearer ${storedToken}`} })
        .then((response) => {
          setComments([...comments, response.data]);
          setComment("");
          console.log("Comments array:", comments)
        })
        .catch((error) => {
          console.error("Error posting comment:", error);
        });
    }
  };

  const handleDeletion = (commentId) => {
    const storedToken = localStorage.getItem("authToken");
    axios.delete(`${import.meta.env.VITE_API_URL}/reference/${commentId}`, { headers: { Authorization: `Bearer ${storedToken}`} })
      .then((response) => {
        console.log(response)
        setComments(comments.filter(element => element._id !== commentId))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="w-2/3 bg-white rounded-lg border p-4 my-4 m-auto mt-10">
      <h3 className="font-bold text-xl mb-3 ">Reviews</h3>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          {comments.map((c) => (
            <div
              key={c._id}
              className="border rounded-md p-3 ml-1 md:ml-3 md:mr-3 my-2"
            >
              <div className="flex gap-3 items-center">
                <h3 className="font-bold text-lg">{c.senderName} ({new Date(c.date).toLocaleDateString('de-DE')})</h3>
                { c?.sender === userInformation?._id &&
                  <button type="button" onClick={() => handleDeletion(c._id)} className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Delete</button>

                }
              </div>
              <p className="text-gray-800 mt-2">{c.content}</p>
            </div>
          ))}
        </div>

{/* write a review is rendered only upong log-in */}

{isLoggedIn && 
    <div>
        <div className="mb-4 px-3 ">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className=" bg-gray-100 rounded border border-gray-400 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none "
            id="name"
            type="text"
            placeholder="Enter your name"
            required
            value={userInformation.name}
          />
        </div>

        <div className="w-full px-3 mb-4">
          <textarea
            className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
            name="body"
            placeholder="Enter Your Review"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <div className="w-full flex justify-end px-3">
          <input
            type="submit"
            className="px-4 py-2 rounded-md text-white text-sm bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300"
            value="Post Comment"
          />
        </div>
    </div>
    }
      </form>
    </div>
  );
}

export default Comments;
