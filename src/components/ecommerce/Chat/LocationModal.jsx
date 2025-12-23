import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Button, Spinner } from "react-bootstrap";
import "leaflet/dist/leaflet.css";

const locationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

function Recenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 13);
  }, [coords, map]);
  return null;
}

const LocationMap = ({ onSendLocation }) => {
  const [coords, setCoords] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCoords = [latitude, longitude];
        setCoords(newCoords);
        setSelected(newCoords);
        setLoading(false);
        fetchAddress(latitude, longitude);
      },
      (err) => {
        console.error(err);
        alert("Please enable location permissions");
        setLoading(false);
      }
    );
  }, []);

  const fetchAddress = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setAddress(data.display_name || "Unknown location");
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const handleSend = () => {
    if (selected) {
      const link = `https://www.google.com/maps?q=${selected[0]},${selected[1]}`;
      onSendLocation(
        <span>
          <i className="bi bi-geo-alt-fill text-primary"></i>{" "}
          <a href={link} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </span>
      );
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" /> <p>Loading map...</p>
      </div>
    );

  return (
    <div className="container py-4" style={{ maxWidth: "960px" }}>
      {/* Toolbar */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="light" className="border-0">
          <i className="bi bi-x-lg fs-4 text-muted"></i>
        </Button>
      </div>

      {/* Title */}
      <h1 className="text-center mb-4 fw-bold">Share Location</h1>

      {/* Map */}
      <div
        className="rounded shadow-sm overflow-hidden"
        style={{ height: "480px", background: "#fff" }}
      >
        <MapContainer
          center={coords || [30.0444, 31.2357]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(map) => map.invalidateSize()}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Recenter coords={selected} />
          {selected && (
            <Marker position={selected} icon={locationIcon}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Address */}
      <div className="text-center mt-3 text-secondary">
        <p>{address}</p>
      </div>

      {/* Send Button */}
      <div className="d-flex justify-content-center mt-3">
        <Button
          variant="info"
          className="text-white px-5 py-2 fw-bold"
          onClick={handleSend}
        >
          <i className="bi bi-send me-2"></i>Send Location
        </Button>
      </div>
    </div>
  );
};

export default LocationMap;
