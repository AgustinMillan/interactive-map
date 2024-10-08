import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateFilter = ({ events, setInfoView }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startData, setStartData] = useState(null);
  const today = new Date();

  useEffect(() => {
    if (startData === null) {
      setStartData(events);
    }
  }, []);

  useEffect(() => {
    if (startData) {
      handleChangeFilter();
    }
  }, [startDate, endDate]);

  const filterEvent = (eventsToFilter) => {
    const response = eventsToFilter.filter((eventsToFilter) => {
      const eventoFecha = new Date(eventsToFilter.fecha);
      if (startDate && endDate) {
        return eventoFecha >= startDate && eventoFecha <= endDate;
      } else if (startDate) {
        return eventoFecha >= startDate;
      } else if (endDate) {
        return eventoFecha <= endDate;
      }
      return true;
    });

    setInfoView(response);
  };

  const handleChangeFilter = () => filterEvent(startData);

  return (
    <div className="flex flex-col">
      <label>Desde: </label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Seleccionar fecha inicial"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        maxDate={today}
      />

      <label>Hasta: </label>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Seleccionar fecha final"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        maxDate={today}
      />
    </div>
  );
};

DateFilter.propTypes = {
  events: PropTypes.array,
  setInfoView: PropTypes.func,
};

export default DateFilter;
