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
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Button,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { concatArrays, getSearch, handlePopup } from "../common/helpers.js";
import MoreVariables from "./moreVariables.jsx";
import appLogo from "../assets/imgs/logo-app.png";
import dictucLogo from "../assets/imgs/logo-dictuc.png";
import corfoLogo from "../assets/imgs/corfo.png";
import dgaImg from "../assets/imgs/dga.jpg";
import PopupComponent from "./popupComponent.jsx";

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
  const [search, setSearch] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

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

  const handleShowActionModal = () => setShowActionModal(true);
  const handleCloseActionModal = () => setShowActionModal(false);

  const handleShowOtherActionModal = () => setShowOtherActionModal(true);
  const handleCloseOtherActionModal = () => setShowOtherActionModal(false);

  useEffect(() => {}, [geoData]);

  const handleSearch = (e) => {
    e.preventDefault();
    setGeoData(getSearch(search, originalGeoData));
  };

  const onChangeSearch = (e) => {
    setSearch(e);
    const filter = getSearch(search, originalGeoData);

    const notView = [];
    variables.map((item) => {
      if (item.map === false) {
        notView.push(item.codigo_variable);
      }
    });

    const cleanArray = [];
    filter.map((item) => {
      if (!notView.includes(item.variableName)) {
        cleanArray.push(item.data);
      }
    });

    setSuggestions(concatArrays(cleanArray));
    setGeoData(filter);
  };

  const handleSuggestionClick = (featureId) => {
    // Accede al objeto del mapa desde el ref
    const map = mapRef.current;

    if (!map) return;

    // Encuentra el punto del featureId en el mapa
    map.eachLayer((layer) => {
      if (layer.feature?.properties?.cod_ele === featureId) {
        // Simula un evento `click` en la capa
        layer.fire("click");
      }
    });
  };

  return (
    <div className="map-view">
      {/* Barra de navegación superior */}
      <Navbar bg="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="#home">
            {/* Aquí puedes colocar tu logo */}
            <img
              src={appLogo}
              alt="Explorador Ambiental"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              {/* Modelos */}
              <Nav.Link onClick={handleShowActionModal}>Modelos</Nav.Link>

              {/* Descargas */}
              <Nav.Link onClick={handleShowOtherActionModal}>
                Descargas
              </Nav.Link>

              {/* Proyecto */}
              <Nav.Link onClick={() => setShowProjectModal(true)}>
                Proyecto
              </Nav.Link>

              {/* Material de Apoyo */}
              <NavDropdown
                title="Material de apoyo"
                id="support-material-dropdown"
              >
                <NavDropdown.Item href="#support-item-1">
                  Item 1
                </NavDropdown.Item>
                <NavDropdown.Item href="#support-item-2">
                  Item 2
                </NavDropdown.Item>
                <NavDropdown.Item href="#support-item-3">
                  Item 3
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
      <div className={`shadow bg-slate-500`}>
        <form onSubmit={(e) => handleSearch(e)}>
          <input type="text" onChange={(e) => onChangeSearch(e.target.value)} />
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i>
          </button>
          {suggestions.length && (
            <ul>
              {suggestions.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() =>
                      handleSuggestionClick(item.properties.cod_ele)
                    }
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {`${item?.properties?.cod_ele} | ${item?.properties?.nombre}`}
                  </li>
                );
              })}
            </ul>
          )}
        </form>
      </div>

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
      <footer className="footer bg-dark">
        <Container
          fluid
          className="d-flex flex-column flex-md-row justify-content-between align-items-center"
        >
          <div className="d-flex justify-content-center justify-content-md-start">
            {/* Logos a la izquierda y derecha en una fila */}
            <a href="https://www.dictuc.cl" target="new">
              <img
                src={dictucLogo}
                alt="Dictuc"
                className="d-inline-block align-top"
                style={{ width: "130px", height: "auto", margin: "1rem" }}
              />
            </a>
          </div>
          <div className="text-center my-2">
            {/* Legales al centro, ocupa toda la fila en mobile */}
            <small>
              &copy; 2025 Dictuc [nombre del equipo]. Todos los derechos
              reservados.
            </small>
          </div>
          <div className="d-flex justify-content-center justify-content-md-end">
            {/* Logos a la derecha */}
            <a href="https://www.corfo.cl" target="new">
              <img
                src={corfoLogo}
                alt="Corfo"
                className="d-inline-block align-top me-2"
                style={{ width: "80px", height: "auto" }}
              />
            </a>
            <a href="https://dga.mop.gob.cl/" target="new">
              <img
                src={dgaImg}
                alt="Dirección General de Aguas DGA"
                className="d-inline-block align-top"
                style={{ width: "80px", height: "auto" }}
              />
            </a>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default MapView;
