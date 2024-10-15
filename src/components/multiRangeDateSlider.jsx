/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Range } from "react-range";
import dayjs from "dayjs";

const MultiRangeDateSlider = ({ initialValue, minDate, maxDate, onChange }) => {
  const [values, setValues] = useState([minDate, maxDate]);

  useEffect(() => {
    setValues([minDate, maxDate]);
  }, [minDate, maxDate]);

  const formatDate = (timestamp) => dayjs(timestamp).format("YYYY-MM-DD");

  const handleRangeChange = (newValues) => {
    setValues(newValues);
    onChange(newValues);
  };

  return (
    <div className="w-full max-w-md mx-auto my-8">
      <Range
        step={24 * 60 * 60 * 1000} // Un día en milisegundos
        min={initialValue.minDate}
        max={initialValue.maxDate}
        values={values}
        onChange={handleRangeChange} // Llamar a la función que actualiza el rango
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="w-full h-2 bg-gray-300 rounded"
            style={{ ...props.style }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-5 h-5 bg-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{ ...props.style }}
          />
        )}
      />
      <div className="flex justify-between mt-4">
        <span className="text-gray-600">Min: {formatDate(values[0])}</span>
        <span className="text-gray-600">Max: {formatDate(values[1])}</span>
      </div>
    </div>
  );
};

export default MultiRangeDateSlider;
