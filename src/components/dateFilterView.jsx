import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateFilter = ({ events, setInfoView }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [originalEvents, setOriginalEvents] = useState([]);

  useEffect(() => {
    setOriginalEvents(events);
    setInfoView(events);
  }, [events]);

  useEffect(() => {
    handleChangeFilter();
  }, [startDate, endDate]);

  const filterEvent = () => {
    const response = originalEvents.filter((event) => {
      const eventDate = new Date(event.fecha);
      if (startDate && endDate) {
        return eventDate >= startDate && eventDate <= endDate;
      }
      return true;
    });
    setInfoView(response);
  };

  const handleChangeFilter = () => {
    filterEvent();
  };

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
        yearDropdownItemNumber={15}
      />

      <label>Hasta: </label>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Seleccionar fecha final"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={15}
      />
    </div>
  );
};

DateFilter.propTypes = {
  events: PropTypes.array.isRequired,
  setInfoView: PropTypes.func.isRequired,
};

export default DateFilter;
