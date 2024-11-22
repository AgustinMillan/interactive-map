// src/components/mapView.jsx

import { useState, useEffect } from "react";
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
import { faBars, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

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
  const [mapStyle, setMapStyle] = useState("osm");
  const [search, setSearch] = useState("");
  // const [lastSearch, setLastSearch] = useState("");

  // Estados para controlar la visibilidad de las sidebars
  const [showToolsSidebar, setShowToolsSidebar] = useState(true);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);

  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showOtherActionModal, setShowOtherActionModal] = useState(false);

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

      setOriginalGeoData((prev) => [
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
        setShowAnalysisPanel(true);
        setSelectedFeatureId(feature.properties.cod_ele);
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

  const getFeatureStyle = (feature) => {
    const isSelected = feature.properties.cod_ele === selectedFeatureId;
    return {
      fillColor: isSelected ? "red" : "blue",
      weight: 2,
      opacity: 1,
      color: "white",
      fillOpacity: 0.6,
    };
  };

  const handleShowActionModal = () => setShowActionModal(true);
  const handleCloseActionModal = () => setShowActionModal(false);

  const handleShowOtherActionModal = () => setShowOtherActionModal(true);
  const handleCloseOtherActionModal = () => setShowOtherActionModal(false);

  useEffect(() => {}, [geoData]);

  const handleSearch = (e) => {
    e.preventDefault();
    let filter = [];
    originalGeoData.map((geo) => {
      const arr = [];
      geo.data.map((item) => {
        const regex = new RegExp(search, "i");
        if (
          regex.test(item.properties.cod_ele) ||
          regex.test(item.properties?.nombre) ||
          regex.test(item.properties?.codigo)
        ) {
          arr.push(item);
        }
      });
      if (arr.length) {
        filter.push({ ...geo, data: arr });
      }
    });
    setGeoData(filter);
    // setLastSearch(search);
  };

  return (
    <div className="map-view">
      {/* Barra de navegación superior */}
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="#home">
            {/* Aquí puedes colocar tu logo */}
            <img
              src="/ruta/a/tu/logo.png"
              alt="Logo"
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Inicio</Nav.Link>
              <Nav.Link href="#features">Características</Nav.Link>
              <NavDropdown title="Menú" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleShowActionModal}>
                  Acción
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleShowOtherActionModal}>
                  Otra acción
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Algo más aquí
                </NavDropdown.Item>
              </NavDropdown>
              {/* Añade más elementos de menú según necesites */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Botones para mostrar/ocultar las sidebars */}
      <Button
        variant="primary"
        className="toggle-sidebar-btn"
        onClick={() => setShowToolsSidebar(!showToolsSidebar)}
      >
        <FontAwesomeIcon icon={faBars} />
      </Button>

      <Button
        variant="primary"
        className="toggle-analysis-btn"
        onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </Button>

      {/* Sidebar de herramientas */}
      <div
        className={`tools-sidebar ${
          showToolsSidebar ? "visible" : "hidden"
        } shadow`}
      >
        <VariablesView
          variables={variables}
          visibleLayers={visibleLayers}
          toggleLayerVisibility={toggleLayerVisibility}
          viewLoadData={viewLoadData}
          handleLoadVariable={handleLoadVariable}
          mapStyle={mapStyle}
          handleMapStyleChange={handleMapStyleChange}
        />
      </div>

      {/* busqueda */}
      <div className={`shadow bg-slate-500`}>
        <form onSubmit={(e) => handleSearch(e)}>
          <input type="text" onChange={(e) => setSearch(e.target.value)} />
          <input type="submit" />
        </form>
      </div>

      {/* Contenedor del mapa */}
      <div className="map-container">
        <MapContainer
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
                  style={getFeatureStyle}
                >
                  {selectedVariableName && (
                    <Popup>
                      <div className="">
                        <div className="card mb-3">
                          <div className="card-body">
                            <p className="card-text">
                              <strong>Variable:</strong>
                              {selectedVariableName?.replace("_", " ")}
                            </p>
                            <ul className="list-unstyled">
                              {Object.entries(selectedFeatureInfo).map(
                                ([key, value]) => (
                                  <li key={key}>
                                    <strong>{key}:</strong> {value}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
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
          <Modal.Title>Acción</Modal.Title>
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
          <Modal.Title>Otra acción</Modal.Title>
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

      {/* Panel de análisis */}
      <div
        className={`analysis-panel ${
          showAnalysisPanel ? "visible" : "hidden"
        } shadow`}
      >
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
      <footer className="footer bg-light">
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
        >
          <div>
            {/* Logo a la izquierda */}
            <img
              src="/ruta/a/tu/logo.png"
              alt="Logo"
              height="30"
              className="d-inline-block align-top"
            />
          </div>
          <div>
            {/* Legales al centro */}
            <small>
              &copy; 2023 Tu Empresa. Todos los derechos reservados.
            </small>
          </div>
          <div className="d-flex">
            {/* Dos logos a la derecha */}
            <img
              src="/ruta/a/logo1.png"
              alt="Logo 1"
              height="30"
              className="d-inline-block align-top me-2"
            />
            <img
              src="/ruta/a/logo2.png"
              alt="Logo 2"
              height="30"
              className="d-inline-block align-top"
            />
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default MapView;
