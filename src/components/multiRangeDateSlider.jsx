// src/components/multiRangeDateSlider.jsx

import { useState, useEffect } from "react";
import { Range } from "react-range";
import dayjs from "dayjs";

// Funciones utilitarias
const formatDate = (timestamp) => dayjs(timestamp).format("YYYY-MM-DD");
const parseDate = (dateString) => dayjs(dateString).valueOf();

const MultiRangeDateSlider = ({ minDate, maxDate, onChange }) => {
  const [values, setValues] = useState([minDate, maxDate]);
  const [fromDate, setFromDate] = useState(formatDate(minDate));
  const [toDate, setToDate] = useState(formatDate(maxDate));

  useEffect(() => {
    if (minDate === maxDate) {
      const adjustedMin = minDate - 24 * 60 * 60 * 1000; // Un día antes
      const adjustedMax = maxDate + 24 * 60 * 60 * 1000; // Un día después
      setValues([adjustedMin, adjustedMax]);
      setFromDate(formatDate(adjustedMin));
      setToDate(formatDate(adjustedMax));
    } else {
      setValues([minDate, maxDate]);
      setFromDate(formatDate(minDate));
      setToDate(formatDate(maxDate));
    }
  }, [minDate, maxDate]);

  const handleRangeChange = (newValues) => {
    setValues(newValues);
    setFromDate(formatDate(newValues[0]));
    setToDate(formatDate(newValues[1]));
    onChange(newValues);
  };

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    const newFromTimestamp = parseDate(newFromDate);

    if (newFromTimestamp <= values[1]) {
      setValues([newFromTimestamp, values[1]]);
      setFromDate(newFromDate);
      onChange([newFromTimestamp, values[1]]);
    }
  };

  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    const newToTimestamp = parseDate(newToDate);

    if (newToTimestamp >= values[0]) {
      setValues([values[0], newToTimestamp]);
      setToDate(newToDate);
      onChange([values[0], newToTimestamp]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-8">
      {/* Inputs de fechas */}
      <div className="flex justify-between mb-4">
        <div>
          <label>Desde:</label>
          <input
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            min={formatDate(minDate)}
            max={formatDate(maxDate)}
          />
        </div>
        <div>
          <label>Hasta:</label>
          <input
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            min={formatDate(minDate)}
            max={formatDate(maxDate)}
          />
        </div>
      </div>

      {/* Slider de rango */}
      <Range
        step={24 * 60 * 60 * 1000} // Incremento en días
        min={minDate}
        max={maxDate}
        values={values}
        onChange={handleRangeChange}
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

      {/* Visualización de límites */}
      <div className="flex justify-between mt-4">
        <span className="text-gray-600">Min: {formatDate(values[0])}</span>
        <span className="text-gray-600">Max: {formatDate(values[1])}</span>
      </div>
    </div>
  );
};

export default MultiRangeDateSlider;