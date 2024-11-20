// src/components/variablesView.jsx

import PropTypes from "prop-types";

const VariablesView = ({
  variables,
  visibleLayers,
  toggleLayerVisibility,
  viewLoadData,
  handleLoadVariable,
}) => {
  return (
    <div className="flex flex-col w-full items-start">
      <h4>Variables</h4>
      <div className="flex w-full flex-wrap">
        {variables.map((variable) => {
          if (variable.map === true) {
            const isVisible = visibleLayers[variable.codigo_variable];
            return (
              <div
                key={variable.variable_name}
                className="flex flex-col items-start m-2"
              >
                {/* Botón para alternar visibilidad */}
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

                {/* Botón para cargar la variable */}
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
          }
          return null;
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