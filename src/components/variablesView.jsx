// src/components/variablesView.jsx

import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { DateFilterContext } from "../context/dateFilter.context";
import DateFilter from "./dateFilterView";

const VariablesView = ({
  variables,
  visibleLayers,
  toggleLayerVisibility,
  viewLoadData,
  handleLoadVariable,
  mapStyle,
  handleMapStyleChange,
}) => {
  const { state } = useContext(DateFilterContext);
  const [dateFilter, setDateFilter] = useState(false);
  useEffect(() => {
    variables?.map((variable) => {
      viewLoadData[variable.codigo_variable] && variable.map === true
        ? handleLoadVariable(variable)
        : null;
    });
  }, [handleLoadVariable, variables, viewLoadData]);

  useEffect(() => {
    if (state) {
      setDateFilter(true);
    }
  }, [state]);
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
              </div>
            );
          }
          return null;
        })}
      </div>
      {dateFilter && (
        <div className="card">
          <div className="card-body">
            <DateFilter
              events={state.events || []}
              dateRange={state.dateRange}
              setDateRange={state.setDateRange}
              setInfoView={state.setInfoView}
              setInfoAssociated={state.setInfoAssociated}
            />
          </div>
        </div>
      )}

      <select value={mapStyle} onChange={handleMapStyleChange}>
        <option value="osm">Mapa Estándar</option>
        <option value="satellite">Vista Satélite</option>
        <option value="dark">Vista Oscura</option>
        <option value="topo">Vista Topografica</option>
      </select>
    </div>
  );
};

VariablesView.propTypes = {
  variables: PropTypes.array,
  visibleLayers: PropTypes.object,
  toggleLayerVisibility: PropTypes.func,
  viewLoadData: PropTypes.object,
  handleLoadVariable: PropTypes.func,
  mapStyle: PropTypes.string,
  handleMapStyleChange: PropTypes.func,
};

export default VariablesView;
