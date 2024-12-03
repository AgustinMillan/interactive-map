import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import appLogo from "../assets/imgs/logo-app.png";
import PropTypes from "prop-types";

const NavBarComponent = ({
  setShowOtherActionModal,
  setShowActionModal,
  setShowProjectModal,
}) => {
  const handleShowOtherActionModal = () => setShowOtherActionModal(true);
  const handleShowActionModal = () => setShowActionModal(true);

  return (
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
            <Nav.Link onClick={handleShowOtherActionModal}>Descargas</Nav.Link>

            {/* Proyecto */}
            <Nav.Link onClick={() => setShowProjectModal(true)}>
              Proyecto
            </Nav.Link>

            {/* Material de Apoyo */}
            <NavDropdown
              title="Material de apoyo"
              id="support-material-dropdown"
            >
              <NavDropdown.Item href="#support-item-1">Item 1</NavDropdown.Item>
              <NavDropdown.Item href="#support-item-2">Item 2</NavDropdown.Item>
              <NavDropdown.Item href="#support-item-3">Item 3</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

NavBarComponent.propTypes = {
  setShowOtherActionModal: PropTypes.func.isRequired,
  setShowActionModal: PropTypes.func.isRequired,
  setShowProjectModal: PropTypes.func.isRequired,
};

export default NavBarComponent;
