import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { defaultIcon } from '../utils/leafletIconFix'
import L from 'leaflet'

L.Marker.prototype.options.icon = defaultIcon

function LocationMarker({ onChange }) {
  const [position, setPosition] = useState(null)

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onChange(e.latlng)
    }
  })

  return position ? <Marker position={position} /> : null
}

export default function MapPicker({ onLocationSelect }) {
  const [center, setCenter] = useState([-1.2921, 36.8219]) // Nairobi

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude])
      }
    )
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '350px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      <LocationMarker
        onChange={(latlng) => {
          onLocationSelect({
            lat: latlng.lat,
            lng: latlng.lng
          })
        }}
      />
    </MapContainer>
  )
}
