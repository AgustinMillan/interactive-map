import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import getStartupVariables from "./getStartupVariables.js";
import loadMapData from "./fileMapUpload";
import InfoView from "./infoView";

const MapView = () => {
  const [geoData, setGeoData] = useState([]);
  const [visibleLayers, setVisibleLayers] = useState({});
  const [variables, setVariables] = useState([]);
  const [selectedFeatureInfo, setSelectedFeatureInfo] = useState(null);
  const [selectedVariableName, setSelectedVariableName] = useState(""); // Estado para el nombre de la variable

  useEffect(() => {
    // Cargar las variables desde el Excel al montar el componente
    const fetchVariables = async () => {
      const vars = await getStartupVariables();
      setVariables(vars);
    };

    fetchVariables();
  }, []);

  const handleLoadVariable = async (variable) => {
    const geoJson = await loadMapData(variable.codigo_variable);
    if (geoJson) {
      setGeoData((prev) => [
        ...prev,
        { data: geoJson, variableName: variable.codigo_variable },
      ]);
      setVisibleLayers((prevState) => ({
        ...prevState,
        [variable.codigo_variable]: true,
      }));
    }
  };

  const toggleLayerVisibility = (variableName) => {
    setVisibleLayers((prevState) => ({
      ...prevState,
      [variableName]: !prevState[variableName],
    }));
  };

  // Función para manejar el click en las features del mapa
  const onEachFeature = (variableName) => (feature, layer) => {
    layer.on({
      click: () => {
        // Actualizar el estado con la información de la feature seleccionada
        setSelectedFeatureInfo(feature.properties);
        setSelectedVariableName(variableName); // Almacenar el nombre de la variable
      },
    });
  };

  return (
    <div>
      {variables.map((variable) => {
        const isVisible = visibleLayers[variable.codigo_variable];
        return (
          <div key={variable.variable_name} className="flex">
            <button
              className={`m-1 p-1 ${
                isVisible ? "bg-green-500" : "bg-gray-500"
              }`}
              onClick={() => toggleLayerVisibility(variable.codigo_variable)}
            >
              {isVisible ? "Ocultar" : "Mostrar"} {variable.codigo_variable}
            </button>
            <button
              className="m-1 p-1 bg-blue-500"
              onClick={() => handleLoadVariable(variable)}
            >
              Cargar {variable.variable_name}
            </button>
          </div>
        );
      })}

      <MapContainer
        center={[-33.45, -70.65]}
        zoom={8}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {geoData.map((layer, index) =>
          visibleLayers[layer.variableName] ? (
            <GeoJSON
              key={index}
              data={layer.data}
              onEachFeature={onEachFeature(layer.variableName)} // Pasar el nombre de la variable
            />
          ) : null
        )}
      </MapContainer>

      {/* Mostrar la información de la feature seleccionada */}
      {selectedFeatureInfo && (
        <InfoView
          selectedFeatureInfo={selectedFeatureInfo}
          variableName={selectedVariableName} // Pasar el nombre de la variable
        />
      )}
    </div>
  );
};

export default MapView;
