import PropTypes from "prop-types";

const MoreVariables = ({
  variables,
  visibleLayers,
  toggleLayerVisibility,
  setViewMoreVariables,
}) => {
  const sliceVars = variables.slice(4, variables.length);
  return (
    <div className="flex w-full flex-wrap">
      <button onClick={() => setViewMoreVariables(false)}>cerrar</button>
      {sliceVars.map((variable, index) => {
        const isVisible = visibleLayers[variable.codigo_variable];
        return (
          <div key={variable.variable_name + index}>
            <button
              className={`flex flex-col items-center justify-center toggle-button ${
                isVisible ? "active" : "inactive"
              }`}
              onClick={() => toggleLayerVisibility(variable.codigo_variable)}
            >
              <span className={`fas ${variable.icon}`} />
              <span className="text-xs mt-2">{variable.variable_name}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

MoreVariables.propTypes = {
  variables: PropTypes.array,
  visibleLayers: PropTypes.object,
  toggleLayerVisibility: PropTypes.func,
  setViewMoreVariables: PropTypes.func,
};

export default MoreVariables;
