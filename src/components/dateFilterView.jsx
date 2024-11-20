
// src/components/dateFilterView.jsx

import PropTypes from "prop-types";
import { useEffect } from "react";
import MultiRangeDateSlider from "./MultiRangeDateSlider";
import { calculateDateRange } from "../common/helpers";

const DateFilter = ({ events, dateRange, setDateRange }) => {
  useEffect(() => {
    if (events.length > 0) {
      const { min, max } = calculateDateRange(events);
      if (!dateRange.min || !dateRange.max) {
        setDateRange({ min, max });
      }
    }
  }, [events, dateRange, setDateRange]);

  const handleRangeChange = ([newMin, newMax]) => {
    setDateRange({ min: newMin, max: newMax });
  };

  return (
    <div className="flex flex-col">
      <label>Filtrar por rango de fechas:</label>
      {dateRange.min && dateRange.max ? (
        <MultiRangeDateSlider
          minDate={dateRange.min}
          maxDate={dateRange.max}
          onChange={handleRangeChange}
        />
      ) : (
        <p className="text-gray-500">Cargando rango de fechas...</p>
      )}
    </div>
  );
};

DateFilter.propTypes = {
  events: PropTypes.array.isRequired,
  dateRange: PropTypes.object.isRequired,
  setDateRange: PropTypes.func.isRequired,
};

export default DateFilter;