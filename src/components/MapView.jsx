import "leaflet/dist/leaflet.css"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet"
import {Icon, divIcon} from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"


const markers = [
    {
      _id: 123456,
      location: [52.52362,13.40720],
      title: "Magic Jazz Evening",
      date: "17 June 2024, 20h",
      prices: 20
    },
    {
      _id: 123456,
      location: [52.53929,13.41371],
      title: "Indie Rock Jam Session",
      date: "20 June 2024, 19h",
      prices: 15
    },
    {
      _id: 123456,
      location: [52.4615,13.3251],
      title: "Soul Sisters Live",
      date: "15 July 2024, 18h",
      prices: 10
    }
  ];
  
  const customIcon = new Icon({
    iconUrl: "/music.png",
    iconSize: [38, 38]
  })

function MapView() {

    return(
        <MapContainer center={[52.52362,13.40720]} zoom={13}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
        />
      <MarkerClusterGroup chunkedLoading>
        {markers.map(marker => (
          <Marker position={marker.location} icon={customIcon}>
            <Popup>
            <h1 className="text-md font-bold underline leading-none">{marker.title}</h1>
            <p className="text md leading-none">{marker.date}</p>
            <p className="text md leading-none">Price: {marker.prices} €</p>
            <Link to={`/concerts/${marker._id}`} className="text md leading-none">See Concert Details</Link>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      </MapContainer>
    )

}
  
  export default MapView