import { useNavigate } from "react-router-dom"

export default function NotFound() {

  const navigate = useNavigate()
    setTimeout( () => {
      navigate("./")
    }, 3000)

  return (
  <div>
    Page not found
  </div>

  )


}