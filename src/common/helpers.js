// interactive-map/src/common/helpers.js
import dayjs from "dayjs";
export const excelDateToISO = (excelDate) => {
  const date = excelDate.slice(0, 10);
  const time = excelDate.slice(11, 19);
  return new Date(`${date}T${time}`).toISOString();
};

export const calculateDateRange = (data, associate = []) => {
  const allDates = [
    ...data.map((item) => dayjs(item.date || item.fecha).valueOf()),
    ...associate.map((item) => dayjs(item.date || item.fecha).valueOf()),
  ];

  if (allDates.length === 0) {
    const now = dayjs().valueOf();
    return { min: now - 24 * 60 * 60 * 1000, max: now + 24 * 60 * 60 * 1000 }; // Rango predeterminado (1 día)
  }

  const minDate = Math.min(...allDates);
  const maxDate = Math.max(...allDates);

  if (minDate === maxDate) {
    return { min: minDate - 24 * 60 * 60 * 1000, max: maxDate + 24 * 60 * 60 * 1000 }; // Ajuste de rango
  }

  return { min: minDate, max: maxDate };
};