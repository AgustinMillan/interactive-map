import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import getInfoFromFile from "./getInfoFromFile";

const InfoView = ({ selectedFeatureInfo, variableName }) => {
  const [infoView, setInfoView] = useState(null);
  useEffect(() => {
    // Cargar las variables desde el Excel al montar el componente
    const fetchInfo = async () => {
      const info = await getInfoFromFile(
        variableName,
        selectedFeatureInfo.cod_ele
      );
      setInfoView(info);
    };

    fetchInfo();
  }, [infoView]);

  return (
    <div className="info-panel">
      <h3>Información del objeto seleccionado:</h3>
      <p>
        <strong>Variable:</strong> {variableName}
      </p>
      <ul>
        {Object.entries(selectedFeatureInfo).map(([key, value], idx) => (
          <li key={idx}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>

      <h3>Información obtenida de la base de datos:</h3>
      <ul>
        {infoView &&
          infoView.map((info, index) => {
            return (
              <li key={index}>
                {info.fecha}: {info.value}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

InfoView.propTypes = {
  selectedFeatureInfo: PropTypes.object,
  variableName: PropTypes.string, // Prop para recibir el nombre de la variable
};

export default InfoView;
