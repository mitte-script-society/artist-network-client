import "leaflet/dist/leaflet.css"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet"
import {Icon, divIcon} from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import { useState } from "react"


function MapView(props) {

    const markers = props.concertData.list
      
      const customIcon = new Icon({
        iconUrl: "/music.png",
        iconSize: [38, 38]
      })

    return(
        <MapContainer center={[50.86,5]} zoom={4}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
        />
    
    {markers && 
      <MarkerClusterGroup chunkedLoading>
        {markers.map(marker => (
          <Marker position={marker.location} icon={customIcon}>
            <Popup>
            <h1 className="text-md font-bold leading-none">{marker.title}</h1>
            <p className="text md leading-none">{new Date(marker.date).toLocaleString('de-DE', {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
            <p className="text md leading-none">Price: {marker.prices} €</p>
            <Link to={`/concerts/${marker._id}`} className="text md leading-none">See Concert Details</Link>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      }

      </MapContainer>
    )

}
  
  export default MapView