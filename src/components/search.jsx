import { useState } from "react";
import { concatArrays, getSearch } from "../common/helpers.js";
import PropTypes from "prop-types";

const SearchComponent = ({
  setGeoData,
  originalGeoData,
  variables,
  mapRef,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setGeoData(getSearch(search, originalGeoData));
  };

  const onChangeSearch = (e) => {
    setSearch(e);
    const filter = getSearch(search, originalGeoData);

    const notView = [];
    variables.map((item) => {
      if (item.map === false) {
        notView.push(item.codigo_variable);
      }
    });

    const cleanArray = [];
    filter.map((item) => {
      if (!notView.includes(item.variableName)) {
        cleanArray.push(item.data);
      }
    });

    setSuggestions(concatArrays(cleanArray));
    setGeoData(filter);
  };

  const handleSuggestionClick = (featureId) => {
    // Accede al objeto del mapa desde el ref
    const map = mapRef.current;

    if (!map) return;

    // Encuentra el punto del featureId en el mapa
    map.eachLayer((layer) => {
      if (layer.feature?.properties?.cod_ele === featureId) {
        // Simula un evento `click` en la capa
        layer.fire("click");
      }
    });
  };

  return (
    <div className={`shadow bg-slate-500`}>
      <form onSubmit={(e) => handleSearch(e)}>
        <input type="text" onChange={(e) => onChangeSearch(e.target.value)} />
        <button type="submit" className="search-btn">
          <i className="fas fa-search"></i>
        </button>
        {suggestions.length && (
          <ul>
            {suggestions.map((item, index) => {
              return (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(item.properties.cod_ele)}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  {`${item?.properties?.cod_ele} | ${item?.properties?.nombre}`}
                </li>
              );
            })}
          </ul>
        )}
      </form>
    </div>
  );
};

SearchComponent.propTypes = {
  variables: PropTypes.array.isRequired,
  originalGeoData: PropTypes.array.isRequired,
  setGeoData: PropTypes.func.isRequired,
  mapRef: PropTypes.any.isRequired,
};

export default SearchComponent;
