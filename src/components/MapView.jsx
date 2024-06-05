import "leaflet/dist/leaflet.css"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useMap } from 'react-leaflet/hooks'
import { Icon, divIcon } from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import { useEffect, useState } from "react"
import { useRef } from "react"


function MapView(props) {

  const [userLocation, setUserLocation] = useState()
  const [showZoom, setShowZoom] = useState(false)

  function ZoomPoint() {
    const map = useMap()
    map.flyTo(userLocation, 14)
    return null
  }


  function geoFindMe() {
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");

    mapLink.href = "";
    mapLink.textContent = "";

    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setUserLocation([latitude, longitude])
      setShowZoom(true)


      status.textContent = "";
      mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    }

    function error() {
      status.textContent = "Unable to retrieve your location";
    }

    if (!navigator.geolocation) {
      status.textContent = "Geolocation is not supported by your browser";
    } else {
      status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }
  
  const markers = props.concertData

  function handleMarkerClick(marker) {
    props.identifyItem(marker)
  }

  const customIcon = new Icon({
    iconUrl: "/music.png",
    iconSize: [38, 38]
  })

  return (
    <>
      <button id="find-me" onClick={geoFindMe}>Find events near me</button><br />
      <p id="status"></p>
      <a id="map-link" target="_blank"></a>

      <MapContainer center={[50.86, 5]} zoom={4}>
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
    </>
  )

}

export default MapView