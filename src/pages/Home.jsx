import DisplayConcerts from "../components/DiplayConcerts"
import Login from "./Login"
import Signup from "./Signup"

export default function Home() {

  return (

    <div className="concerts-main-space">

      <div className="display-concerts-wrapper">
        <DisplayConcerts/>
      </div>
      <div className="map-space">
        <h1 style={{textAlign:"center"}}>The map magic happens here</h1>
      </div>
  
    </div>

  )

}