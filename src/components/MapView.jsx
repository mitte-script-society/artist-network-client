import "leaflet/dist/leaflet.css"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useMap } from 'react-leaflet/hooks'
import { Icon, divIcon } from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import { useEffect, useState } from "react"
import { useRef } from "react"


function MapView(props) {

  const [closestMarker, setClosestMarker] = useState([0,0])
  const [showZoom, setShowZoom] = useState(false)

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;
  
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;
  
    return distance;
  }
  
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  const markers = props.concertData

  function ZoomPoint() {
    const map = useMap()
    map.flyTo(closestMarker, 14)
    return null
  }


  function geoFindMe() {
    const status = document.querySelector("#status");

    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const userLat = latitude
      const userLong = longitude

      markers.map(element => {
        element.distance = calculateDistance(userLat, userLong, element.location[0], element.location[1])
      })

      const markerWithMinDistance = markers.reduce((min, current) => (min.distance < current.distance) ? min : current);

      setClosestMarker(markerWithMinDistance.location)
      setShowZoom(true)
      
    }

    function error() {
      status.textContent = "Unable to retrieve your location";
    }

    if (!navigator.geolocation) {
      status.textContent = "Geolocation is not supported by your browser";
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  function handleMarkerClick(marker) {
    props.identifyItem(marker)
  }

  const customIcon = new Icon({
    iconUrl: "/music.png",
    iconSize: [38, 38]
  })

  return (
    <div className="relative">
      <div className="absolute z-10 top-3 left-12 flex flex-col mt-1 mb-1">
        <button id="find-me" onClick={geoFindMe} className="text-sm font-semibold flex"><img className="h-5 w-5 mr-1" src="search.png"/>Closest Event</button>
        <p id="status" className="text-sm"></p>
      </div>
      <MapContainer center={[50.86, 5]} zoom={4} id="map-cont" className="relative z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
        />
        {showZoom && <ZoomPoint />}
        {markers &&
          <MarkerClusterGroup chunkedLoading>
            {markers.map((marker, index) => (
              <Marker position={marker.location} icon={customIcon} key={index} eventHandlers={{
                click: () => handleMarkerClick(marker),
              }}>
                <Popup>
                  <h1 className="text-md font-bold leading-none">{marker.title}</h1>
                  <p className="text md leading-none">{new Date(marker.date).toLocaleString('de-DE', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text md leading-none">Price: {marker.prices} €</p>
                  <Link to={`/concerts/${marker._id}`} className="text md leading-none">See Concert Details</Link>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        }
      </MapContainer>
    </div>
  )

}

export default MapView