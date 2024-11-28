// src/components/variablesView.jsx

import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { DateFilterContext } from "../context/dateFilter.context";
import DateFilter from "./dateFilterView";
import { formatText } from "../common/helpers";

const VariablesView = ({
  variables,
  visibleLayers,
  toggleLayerVisibility,
  viewLoadData,
  handleLoadVariable,
  mapStyle,
  handleMapStyleChange,
  originalGeoData,
  setViewMoreVariables,
}) => {
  const { state } = useContext(DateFilterContext);
  const [dateFilter, setDateFilter] = useState(false);
  const [toggleFilter, setToggleFilter] = useState(false);

  useEffect(() => {
    if (originalGeoData.length) {
      return;
    }
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
    if (state?.associate.length) {
      setToggleFilter(true);
    } else {
      setToggleFilter(false);
    }
  }, [state]);

  const handleToggleClick = (e) => {
    state.setToggle({ state: true, value: parseInt(e.target.name) });
  };

  let count = 0;
  const variablesNumber = variables.reduce(
    (acc, item) => (item.map ? acc + 1 : acc),
    0
  );
  return (
    <div className="flex flex-col w-full items-center pt-4">
      {toggleFilter && (
        <div className="flex items-center justify-center mb-4 bg-slate-300">
          <button className="toggle" name={0} onClick={handleToggleClick}>
            Ambos
          </button>
          <button className="toggle" name={1} onClick={handleToggleClick}>
            {formatText(state.variableName)}
          </button>
          <button className="toggle" name={2} onClick={handleToggleClick}>
            {formatText(state.associatedName)}
          </button>
        </div>
      )}

      <h4 className="text-center">Variables</h4>
      <div className="flex w-full flex-wrap">
        {variables.map((variable, index) => {
          if (variable.map === true && count < 3) {
            count++;
            const isVisible = visibleLayers[variable.codigo_variable];
            return (
              <div
                key={variable.variable_name + index}
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
                  <span className={`fas ${variable.icon}`} />
                  <span className="text-xs mt-2">{variable.variable_name}</span>
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
      {variablesNumber > 3 && (
        <button onClick={() => setViewMoreVariables(true)}>VER MAS ...</button>
      )}
      {dateFilter && (
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
        <h4 className="text-center pb-2">Tipos de mapas</h4>
        {[
          {
            value: "dark",
            label: "Oscura",
            bg: "url('/src/assets/imgs/mapa-oscura.png')",
          },
          {
            value: "osm",
            label: "Estándar",
            bg: "url('/src/assets/imgs/mapa-estandar.png')",
          },
          {
            value: "satellite",
            label: "Satélite",
            bg: "url('/src/assets/imgs/mapa-relieve.png')",
          },
          {
            value: "topo",
            label: "Topográfica",
            bg: "url('/src/assets/imgs/mapa-topografica.png')",
          },
        ].map((style) => (
          <div className="col m-0 p-0" key={style.value}>
            <button
              className={`map-style-toggle ${
                mapStyle === style.value ? "active" : ""
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),${style.bg}`,
                filter: mapStyle === style.value ? "none" : "grayscale(100%)",
              }}
              onClick={() =>
                handleMapStyleChange({ target: { value: style.value } })
              }
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
  originalGeoData: PropTypes.array,
  setViewMoreVariables: PropTypes.func,
};

export default VariablesView;
