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
    <div className="flex flex-col w-full items-center pt-4">
      <h4 className="text-center">Variables</h4>
      <div className="flex w-full flex-wrap">
        {variables.map((variable, index) => {
          if (variable.map === true) {
            const isVisible = visibleLayers[variable.codigo_variable];
            const icons = ["fa-leaf", "fa-water", "fa-cloud"]; // Hardcodeado por ahora
            return (
              <div
                key={variable.variable_name}
                className="flex items-center justify-center w-1/3"
                style={{ padding: ".1rem" }}
              >
                <button
                  className={`flex flex-col items-center justify-center toggle-button ${
                    isVisible ? "active" : "inactive"
                  }`}
                  onClick={() =>
                    toggleLayerVisibility(variable.codigo_variable)
                  }
                >
                  <span className={`fas ${icons[index % icons.length]}`} />
                  <span className="text-xs mt-2">{variable.variable_name}</span>
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
      {dateFilter && console.log("state", state) && (
        <div className="card">
          <div className="card-body">
            <DateFilter
              events={state.events || []}
              setInfoView={state.setInfoView}
              dateRange={state.dateRange}
              setDateRange={state.setDateRange}
              setInfoAssociated={state.setInfoAssociated}
              associate={state.associate}
            />
          </div>
        </div>
      )}
      
      
      <div className="row map-style-container">
      <h4 className="text-center p-0">Tipos de mapas</h4>
        {[
          { value: "dark", label: "Oscura", bg: "url('/src/assets/imgs/mapa-oscura.png')" },
          { value: "osm", label: "Estándar", bg: "url('/src/assets/imgs/mapa-estandar.png')" },
          { value: "satellite", label: "Satélite", bg: "url('/src/assets/imgs/mapa-relieve.png')" },
          { value: "topo", label: "Topográfica", bg: "url('/src/assets/imgs/mapa-topografica.png')" },  
        ].map((style) => (
          <div className="col m-0 p-0" key={style.value}>
            <button
              className={`map-style-toggle ${mapStyle === style.value ? "active" : ""}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)),${style.bg}`,
                filter: mapStyle === style.value ? "none" : "grayscale(100%)"
              }}
              onClick={() => handleMapStyleChange({ target: { value: style.value } })}
            >
              {style.label}
            </button>
          </div>
        ))}
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
  mapStyle: PropTypes.string,
  handleMapStyleChange: PropTypes.func,
};

export default VariablesView;
