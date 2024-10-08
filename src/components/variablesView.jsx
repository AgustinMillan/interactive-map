import PropTypes from "prop-types";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const VariablesView = ({
  variables,
  visibleLayers,
  toggleLayerVisibility,
  viewLoadData,
  handleLoadVariable,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDiv = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col w-full items-start">
      <button onClick={toggleDiv}>
        {isExpanded ? (
          <>
            <label>Variables</label>
            <ExpandLessIcon />
          </>
        ) : (
          <>
            <label>Variables</label>
            <ExpandMoreIcon />
          </>
        )}
      </button>
      <div className="flex">
        {isExpanded &&
          variables.map((variable) => {
            const isVisible = visibleLayers[variable.codigo_variable];
            return (
              <div key={variable.variable_name} className="flex flex-wrap">
                <button
                  className={`m-1 p-1 ${
                    isVisible ? "bg-green-500" : "bg-gray-500"
                  }`}
                  onClick={() =>
                    toggleLayerVisibility(variable.codigo_variable)
                  }
                >
                  {isVisible ? "Ocultar" : "Mostrar"} {variable.variable_name}
                </button>

                {viewLoadData[variable.codigo_variable] && (
                  <button
                    className="m-1 p-1 bg-blue-500"
                    onClick={() => handleLoadVariable(variable)}
                  >
                    Cargar {variable.variable_name}
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

VariablesView.propTypes = {
  variables: PropTypes.array,
  visibleLayers: PropTypes.object,
  toggleLayerVisibility: PropTypes.func,
  viewLoadData: PropTypes.object,
  handleLoadVariable: PropTypes.func,
};

export default VariablesView;
