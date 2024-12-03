import dictucLogo from "../assets/imgs/logo-dictuc.png";
import corfoLogo from "../assets/imgs/corfo.png";
import dgaImg from "../assets/imgs/dga.jpg";
import { Container } from "react-bootstrap";

const FooterComponent = () => {
  return (
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
  );
};

export default FooterComponent;
