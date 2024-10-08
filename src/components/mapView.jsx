import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import getStartupVariables from "./getStartupVariables.js";
import loadMapData from "./fileMapUpload";
import InfoView from "./infoView";
import VariablesView from "./variablesView.jsx";

const MapView = () => {
  const [geoData, setGeoData] = useState([]);
  const [visibleLayers, setVisibleLayers] = useState({});
  const [variables, setVariables] = useState([]);
  const [selectedFeatureInfo, setSelectedFeatureInfo] = useState(null);
  const [selectedVariableName, setSelectedVariableName] = useState("");
  const [viewLoadData, setViewLoadData] = useState({});

  useEffect(() => {
    const fetchVariables = async () => {
      const vars = await getStartupVariables();
      setVariables(vars);

      const initialLoadData = vars.reduce((acc, item) => {
        acc[item.codigo_variable] = true;
        return acc;
      }, {});
      setViewLoadData(initialLoadData);
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

      setViewLoadData((prevState) => ({
        ...prevState,
        [variable.codigo_variable]: false,
      }));
    }
  };

  const toggleLayerVisibility = (variableName) => {
    setVisibleLayers((prevState) => ({
      ...prevState,
      [variableName]: !prevState[variableName],
    }));
  };

  const onEachFeature = (variableName) => (feature, layer) => {
    layer.on({
      click: () => {
        setSelectedFeatureInfo(feature.properties);
        setSelectedVariableName(variableName);
      },
    });
  };

  return (
    <div>
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
              onEachFeature={onEachFeature(layer.variableName)}
            />
          ) : null
        )}
      </MapContainer>

      <VariablesView
        variables={variables}
        visibleLayers={visibleLayers}
        toggleLayerVisibility={toggleLayerVisibility}
        viewLoadData={viewLoadData}
        handleLoadVariable={handleLoadVariable}
      />

      {selectedFeatureInfo && (
        <InfoView
          selectedFeatureInfo={selectedFeatureInfo}
          variableName={selectedVariableName}
        />
      )}
    </div>
  );
};

export default MapView;
