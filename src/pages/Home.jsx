import DisplayConcerts from "../components/DiplayConcerts"
import MapView from "../components/MapView"

export default function Home() {


  return (
    <div className="concerts-main-space">

      <div className="display-concerts-wrapper">
        <DisplayConcerts/>
      </div>
      <div className="map-space">
        <MapView/>
      </div>
  
    </div>

  )

}