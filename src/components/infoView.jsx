import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import getInfoFromFile from "./getInfoFromFile";
import GraphicView from "./graphicView";
import DateFilter from "./dateFilterView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const InfoView = ({
  selectedFeatureInfo,
  variableName,
  associatedVariable,
}) => {
  const [infoView, setInfoView] = useState(null);
  const [originalInfoData, setOriginalInfoData] = useState(null);
  const [originalAssociatedData, setOriginalAssociatedData] = useState(null);
  const [infoAssociated, setInfoAssociated] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastElement, setLastElement] = useState("");

  const toggleDiv = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const element = selectedFeatureInfo.cod_ele;
      if (element !== lastElement || lastElement === "") {
        const info = await getInfoFromFile(variableName, element);
        setInfoView(info);
        setOriginalInfoData(info); // Guardar los datos originales
        setOriginalAssociatedData(null);
        setLastElement(element);

        if (associatedVariable) {
          const infoAssociated = await getInfoFromFile(
            associatedVariable,
            element
          );
          setInfoAssociated(infoAssociated);
          setOriginalAssociatedData(infoAssociated);
        }
      }
    };

    fetchInfo();
  }, [selectedFeatureInfo.cod_ele, variableName]);

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
              <DateFilter
                events={originalInfoData} // Los eventos ahora son los datos originales
                setInfoView={setInfoView} // Mantener la referencia a setInfoView
                associate={originalAssociatedData}
                setInfoAssociated={setInfoAssociated}
              />
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
          {infoView && (
            <GraphicView
              data={infoView}
              variableName={variableName}
              associate={infoAssociated}
              associatedVariable={associatedVariable}
            />
          )}
        </div>
      )}
    </>
  );
};

InfoView.propTypes = {
  selectedFeatureInfo: PropTypes.object,
  variableName: PropTypes.string,
  associatedVariable: PropTypes.any,
};

export default InfoView;
