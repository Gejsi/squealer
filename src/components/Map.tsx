import type { LatLngExpression } from 'leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { icon } from 'leaflet'

const markerIcon = icon({ iconUrl: '/marker-icon.png' })

const Map = ({ position }: { position: LatLngExpression }) => (
  <div className='h-64 w-full'>
    <MapContainer center={position} zoom={13} className='h-full'>
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <Marker position={position} icon={markerIcon} />
    </MapContainer>
  </div>
)

export default Map
