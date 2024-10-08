import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import getInfoFromFile from "./getInfoFromFile";
import GraphicView from "./graphicView";
import DateFilter from "./dateFilterView";

const InfoView = ({ selectedFeatureInfo, variableName }) => {
  const [infoView, setInfoView] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDiv = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchInfo = async () => {
      if (!infoView) {
        const info = await getInfoFromFile(
          variableName,
          selectedFeatureInfo.cod_ele
        );
        setInfoView(info);
      }
    };

    fetchInfo();
  }, [infoView, selectedFeatureInfo.cod_ele, variableName]);

  return (
    <>
      <button onClick={toggleDiv}>
        {isExpanded ? "Contraer" : "Desplegar"}
      </button>
      {isExpanded && (
        <div className="flex">
          <div>
            {infoView && (
              <DateFilter events={infoView} setInfoView={setInfoView} />
            )}
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
          </div>
          <h3>Información obtenida de la base de datos:</h3>
          {infoView && <GraphicView data={infoView} />}
        </div>
      )}
    </>
  );
};

InfoView.propTypes = {
  selectedFeatureInfo: PropTypes.object,
  variableName: PropTypes.string,
};

export default InfoView;
