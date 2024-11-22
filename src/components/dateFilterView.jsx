import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import MultiRangeDateSlider from "./multiRangeDateSlider";

const DateFilter = ({ events, setInfoView, associate, setInfoAssociated }) => {
  const { minDate, maxDate } = events.reduce(
    (acc, curr) => {
      const currentDate = new Date(curr.fecha).getTime();
      acc.minDate = Math.min(acc.minDate, currentDate);
      acc.maxDate = Math.max(acc.maxDate, currentDate);
      return acc;
    },
    {
      minDate: Infinity,
      maxDate: -Infinity,
    }
  );

  // Manejar valores en caso de que no haya eventos
  const minDateValue = minDate === Infinity ? null : minDate;
  const maxDateValue = maxDate === -Infinity ? null : maxDate;

  const [minDateState, setMinDate] = useState(minDateValue);
  const [maxDateState, setMaxDate] = useState(maxDateValue);

  useEffect(() => {
    setMinDate(minDateValue);
    setMaxDate(maxDateValue);
  }, [events, minDateValue, maxDateValue]);

  const handleRangeChange = ([newMinDate, newMaxDate]) => {
    setMinDate(newMinDate);
    setMaxDate(newMaxDate);
  };

  useEffect(() => {
    // Aplicar el filtro cada vez que cambian los límites del rango
    const filteredEvents = events.filter((event) => {
      const eventoFecha = new Date(event.fecha).getTime();
      return eventoFecha >= minDateState && eventoFecha <= maxDateState;
    });

    setInfoView(filteredEvents);

    console.log("associate", associate);
    if (associate) {
      const filteredAssociate = associate.filter((event) => {
        const eventoFecha = new Date(event.fecha).getTime();
        return eventoFecha >= minDateState && eventoFecha <= maxDateState;
      });
      setInfoAssociated(filteredAssociate);
    } else {
      setInfoAssociated(null);
    }
  }, [
    minDateState,
    maxDateState,
    events,
    associate,
    setInfoView,
    setInfoAssociated,
  ]);

  return (
    <div className="flex flex-col">
      <label>Filtrar por rango de fechas:</label>
      <MultiRangeDateSlider
        initialValue={{ minDate: minDateValue, maxDate: maxDateValue }}
        minDate={minDateValue}
        maxDate={maxDateValue}
        onChange={handleRangeChange}
      />
    </div>
  );
};

DateFilter.propTypes = {
  events: PropTypes.array.isRequired,
  setInfoView: PropTypes.func.isRequired,
  associate: PropTypes.any,
  setInfoAssociated: PropTypes.func.isRequired,
};

export default DateFilter;
