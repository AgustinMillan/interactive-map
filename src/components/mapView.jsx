import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// eslint-disable-next-line react/prop-types
const MapView = ({ variables, geoData }) => {
  return (
    <div>
      {Array.isArray(variables) &&
        // eslint-disable-next-line react/prop-types
        variables?.map((variable) => {
          console.log(variable);
          return (
            <button
              key={variable.variableName}
              className="m-1 p-1 bg-slate-500"
            >
              {variable.variable_name}
            </button>
          );
        })}
      <MapContainer
        center={[-33.45, -70.65]}
        zoom={8}
        style={{ height: "500px", width: "100%" }} // Tamaño del mapa
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="thtps://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {geoData && <GeoJSON data={geoData} />}
      </MapContainer>
    </div>
  );
};

export default MapView;
