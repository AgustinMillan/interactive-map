import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import getStartupVariables from "./getStartupVariables.js";
import loadMapData from "./fileMapUpload";
import InfoView from "./infoView";
import VariablesView from "./variablesView.jsx";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = () => {
  const [geoData, setGeoData] = useState([]);
  const [visibleLayers, setVisibleLayers] = useState({});
  const [variables, setVariables] = useState([]);
  const [selectedFeatureInfo, setSelectedFeatureInfo] = useState(null);
  const [selectedVariableName, setSelectedVariableName] = useState("");
  const [associatedVariable, setAssociatedVariable] = useState("");
  const [unit, setUnit] = useState("");
  const [graficType, setGraficType] = useState("");
  const [viewLoadData, setViewLoadData] = useState({});
  const [mapStyle, setMapStyle] = useState("osm");

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
    const { codigo_variable, asociado, unidad, grafico } = variable;

    const geoJson = await loadMapData(codigo_variable);
    if (geoJson) {
      setGeoData((prev) => [
        ...prev,
        {
          data: geoJson,
          variableName: codigo_variable,
          associatedVariable: asociado === "-" || !asociado ? null : asociado,
          unit: unidad,
          graficType: grafico,
        },
      ]);

      setVisibleLayers((prevState) => ({
        ...prevState,
        [codigo_variable]: true,
      }));

      setViewLoadData((prevState) => ({
        ...prevState,
        [codigo_variable]: false,
      }));
    }
  };

  const toggleLayerVisibility = (variableName) => {
    setVisibleLayers((prevState) => ({
      ...prevState,
      [variableName]: !prevState[variableName],
    }));
  };

  const onEachFeature = (variable) => (feature, layer) => {
    layer.on({
      click: () => {
        setSelectedFeatureInfo(feature.properties);
        setAssociatedVariable(variable.associatedVariable);
        setSelectedVariableName(variable.variableName);
        setUnit(variable.unit);
        setGraficType(variable.graficType?.toUpperCase());
      },
    });
  };

  const handleMapStyleChange = (event) => {
    setMapStyle(event.target.value);
  };

  const tileLayerUrls = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
    dark: {
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
      attribution:
        "&copy; Stadia Maps, OpenMapTiles, OpenStreetMap contributors",
    },
    topo: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "Map data &copy; OpenTopoMap contributors",
    },
  };

  return (
    <div>
      <select value={mapStyle} onChange={handleMapStyleChange}>
        <option value="osm">Mapa Estándar</option>
        <option value="satellite">Vista Satélite</option>
        <option value="dark">Vista Oscura</option>
        <option value="topo">Vista Topografica</option>
      </select>
      <MapContainer
        center={[-33.45, -70.65]}
        zoom={8}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url={tileLayerUrls[mapStyle].url}
          attribution={tileLayerUrls[mapStyle].attribution}
        />

        {geoData.map((layer, index) =>
          visibleLayers[layer.variableName] ? (
            <GeoJSON
              key={index}
              data={layer.data}
              onEachFeature={onEachFeature(layer)}
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
          associatedVariable={associatedVariable}
          variableName={selectedVariableName}
          unit={unit}
          graficType={graficType}
        />
      )}
    </div>
  );
};

export default MapView;
