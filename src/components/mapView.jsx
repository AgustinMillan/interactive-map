// src/components/mapView.jsx
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import getStartupVariables from "./getStartupVariables.js";
import loadMapData from "./fileMapUpload";
import InfoView from "./infoView";
import VariablesView from "./variablesView.jsx";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
// Importamos Bootstrap y FontAwesome
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { handlePopup } from "../common/helpers.js";
import MoreVariables from "./moreVariables.jsx";
import PopupComponent from "./popupComponent.jsx";
import SearchComponent from "./search.jsx";
import FooterComponent from "./footer.jsx";
import NavBarComponent from "./navBar.jsx";

// Configuración de iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = () => {
  const [geoData, setGeoData] = useState([]);
  const [originalGeoData, setOriginalGeoData] = useState([]);
  const [visibleLayers, setVisibleLayers] = useState({});
  const [variables, setVariables] = useState([]);
  const [selectedFeatureInfo, setSelectedFeatureInfo] = useState(null);
  const [selectedVariableName, setSelectedVariableName] = useState("");
  const [associatedVariable, setAssociatedVariable] = useState("");
  const [unit, setUnit] = useState("");
  const [graficType, setGraficType] = useState("");
  const [viewLoadData, setViewLoadData] = useState({});
  const [mapStyle, setMapStyle] = useState("dark");
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Estados para controlar la visibilidad de las sidebars
  const [showToolsSidebar, setShowToolsSidebar] = useState(true);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);

  const [showActionModal, setShowActionModal] = useState(false);
  const [showOtherActionModal, setShowOtherActionModal] = useState(false);
  const [viewMoreVariables, setViewMoreVariables] = useState(false);

  const mapRef = useRef(null);

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
    const { codigo_variable, asociado, unidad, grafico, color } = variable;

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
          color,
        },
      ]);

      setOriginalGeoData((prev) => [
        ...prev,
        {
          data: geoJson,
          variableName: codigo_variable,
          associatedVariable: asociado === "-" || !asociado ? null : asociado,
          unit: unidad,
          graficType: grafico,
          color,
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
        setShowAnalysisPanel(true);
        handlePopup(layer, variable.variableName, feature.properties);
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
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution:
        "&copy; <a href='https://carto.com/attributions'>CARTO</a> contributors",
    },
    topo: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "Map data &copy; OpenTopoMap contributors",
    },
  };

  const handleCloseActionModal = () => setShowActionModal(false);
  const handleCloseOtherActionModal = () => setShowOtherActionModal(false);

  useEffect(() => {}, [geoData]);

  return (
    <div className="map-view">
      {/* Barra de navegación superior */}
      <NavBarComponent
        setShowActionModal={setShowActionModal}
        setShowOtherActionModal={setShowOtherActionModal}
        setShowProjectModal={setShowProjectModal}
      />

      {/* Sidebar de herramientas */}
      <div
        className="tools-sidebar shadow"
        style={{
          transform: showToolsSidebar ? "translateX(0)" : "translateX(-390px)", // Mueve el contenedor
          transition: "transform 0.3s cubic-bezier(0.68, -0.05, 0.27, 1)", // Transición suave con más impetu
        }}
      >
        <Button
          variant="primary"
          className="sidebar-toggle-btn"
          onClick={() => setShowToolsSidebar(!showToolsSidebar)}
          style={{
            position: "absolute",
            // left: showToolsSidebar ? "0" : "0",
            top: "50%",
            zIndex: 10,
            left: "390px",
            width: "20px",
            height: "290px",
          }}
        >
          <FontAwesomeIcon
            icon={showToolsSidebar ? faChevronLeft : faChevronRight}
          />
        </Button>
        <VariablesView
          variables={variables}
          visibleLayers={visibleLayers}
          toggleLayerVisibility={toggleLayerVisibility}
          viewLoadData={viewLoadData}
          handleLoadVariable={handleLoadVariable}
          mapStyle={mapStyle}
          handleMapStyleChange={handleMapStyleChange}
          originalGeoData={originalGeoData}
          setViewMoreVariables={setViewMoreVariables}
        />
      </div>

      {viewMoreVariables && (
        <div>
          <h3>MAS VARIABLES</h3>
          <MoreVariables
            toggleLayerVisibility={toggleLayerVisibility}
            variables={variables}
            visibleLayers={visibleLayers}
            setViewMoreVariables={setViewMoreVariables}
          />
        </div>
      )}

      {/* busqueda */}
      <SearchComponent
        originalGeoData={originalGeoData}
        setGeoData={setGeoData}
        variables={variables}
        mapRef={mapRef}
      />

      {/* Contenedor del mapa */}
      <div className="map-container">
        <MapContainer
          ref={mapRef}
          center={[-33.45, -70.65]}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url={tileLayerUrls[mapStyle].url}
            attribution={tileLayerUrls[mapStyle].attribution}
          />
          {geoData &&
            geoData.map((layer, index) =>
              visibleLayers[layer.variableName] ? (
                <GeoJSON
                  key={`${layer.variableName}${layer.data.length}${index}`}
                  data={layer.data}
                  onEachFeature={onEachFeature(layer)}
                  pointToLayer={(feature, latlng) => {
                    // Aquí definimos cómo se visualizan los puntos
                    return L.circleMarker(latlng, {
                      radius: 10, // Tamaño más grande para hacerlo más visible
                      fillColor: layer.color, // Color de relleno
                      color: layer.color, // Color del borde ligeramente más oscuro
                      weight: 2, // Grosor del borde
                      opacity: 1, // Opacidad del borde
                      fillOpacity: 1, // Relleno completamente opaco
                    });
                  }}
                  style={{
                    fillColor: layer.color, // Color de relleno para polígonos y líneas
                    weight: 0,
                    opacity: 1,
                    color: "transparent",
                    fillOpacity: 0.3,
                  }}
                >
                  {selectedVariableName && (
                    <Popup>
                      <PopupComponent
                        featureInfo={selectedFeatureInfo}
                        variableName={selectedVariableName}
                      />
                    </Popup>
                  )}
                </GeoJSON>
              ) : null
            )}
        </MapContainer>
      </div>

      {/* Modal para "Acción" */}
      <Modal show={showActionModal} onHide={handleCloseActionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modelos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Este es el contenido del modal para &quot;Acción&quot;.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseActionModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para "Otra acción" */}
      <Modal show={showOtherActionModal} onHide={handleCloseOtherActionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Descargas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Este es el contenido del modal para &quot;Otra acción&quot;.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOtherActionModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para "Proyecto" */}
      <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Contenido relacionado con el Proyecto.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowProjectModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Panel de análisis */}
      <div
        className="analysis-panel shadow"
        style={{
          position: "absolute",
          bottom: "7.7rem",
          right: "1rem",
          transform: showAnalysisPanel ? "translateX(0)" : "translateX(680px)", // Mover el panel
          transition: "transform 0.3s ease", // Transición suave
        }}
      >
        <Button
          variant="primary"
          className="analysis-toggle-btn"
          onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
          style={{
            position: "absolute",
            left: "-33px", // Botón fuera del panel
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "30px",
            height: "290px",
            background: "unset",
            border: "unset",
          }}
        >
          <FontAwesomeIcon
            icon={showAnalysisPanel ? faChevronRight : faChevronLeft} // Ícono basado en el estado
          />
        </Button>
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

      {/* Pie de página */}
      <FooterComponent />
    </div>
  );
};

export default MapView;
