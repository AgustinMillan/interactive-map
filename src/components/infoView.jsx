import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import getInfoFromFile from "./getInfoFromFile";
import GraphicView from "./graphicView";
import DateFilter from "./dateFilterView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const InfoView = ({ selectedFeatureInfo, variableName }) => {
  const [infoView, setInfoView] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastElement, setLastElement] = useState("");

  const toggleDiv = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const element = selectedFeatureInfo.cod_ele;
      if (element !== lastElement) {
        const info = await getInfoFromFile(variableName, element);
        setInfoView(info);
        setLastElement(element);
      }
    };

    fetchInfo();
  }, [infoView, selectedFeatureInfo.cod_ele, variableName]);

  return (
    <>
      <button onClick={toggleDiv}>
        {isExpanded ? (
          <>
            <label>Información</label>
            <ExpandLessIcon />
          </>
        ) : (
          <>
            <label>Información</label>
            <ExpandMoreIcon />
          </>
        )}
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
