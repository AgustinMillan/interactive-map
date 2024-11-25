// interactive-map/src/common/helpers.js
import dayjs from "dayjs";
export const excelDateToISO = (excelDate) => {
  const date = excelDate.slice(0, 10);
  const time = excelDate.slice(11, 19);
  return new Date(`${date}T${time}`).toISOString();
};

export const calculateDateRange = (data, associate = []) => {
  let allDates;
  if (associate) {
    allDates = [
      ...data.map((item) => dayjs(item.date || item.fecha).valueOf()),
      ...associate.map((item) => dayjs(item.date || item.fecha).valueOf()),
    ];
  } else {
    allDates = [
      ...data.map((item) => dayjs(item.date || item.fecha).valueOf()),
    ];
  }

  if (allDates.length === 0) {
    const now = dayjs().valueOf();
    return { min: now - 24 * 60 * 60 * 1000, max: now + 24 * 60 * 60 * 1000 }; // Rango predeterminado (1 día)
  }

  const minDate = Math.min(...allDates);
  const maxDate = Math.max(...allDates);

  if (minDate === maxDate) {
    return {
      min: minDate - 24 * 60 * 60 * 1000,
      max: maxDate + 24 * 60 * 60 * 1000,
    }; // Ajuste de rango
  }

  return { min: minDate, max: maxDate };
};

export const getViewToGraphic = (value, datasets) => {
  if (value === 2) {
    return [datasets[1]];
  }
  if (value === 1) {
    return [datasets[0]];
  } else {
    return datasets;
  }
};

export const getSearch = (search, originalGeoData) => {
  let filter = [];
  originalGeoData.map((geo) => {
    const arr = [];
    geo.data.map((item) => {
      const regex = new RegExp(search, "i");
      if (
        regex.test(item.properties.cod_ele) ||
        regex.test(item.properties?.nombre) ||
        regex.test(item.properties?.codigo)
      ) {
        arr.push(item);
      }
    });
    if (arr.length) {
      filter.push({ ...geo, data: arr });
    }
  });

  return filter;
};

export const formatText = (text) => {
  return text?.replace("_", " ") || "";
};

export const concatArrays = (arrays) => {
  return arrays.reduce((acc, curr) => acc.concat(curr), []);
};

export function handlePopup(layer, variableName, properties) {
  layer
    .bindPopup(
      `
        <div class="popup-container">
          <div class="card">
            <div class="card-body">
              <p class="card-text">
                <strong>Variable:</strong> ${formatText(variableName || "N/A")}
              </p>
              <ul class="list-unstyled">
                ${
                  properties
                    ? Object.entries(properties)
                        .map(
                          ([key, value]) =>
                            `<li><strong>${key}:</strong> ${
                              value || "N/A"
                            }</li>`
                        )
                        .join("")
                    : "<li>No information available</li>"
                }
              </ul>
            </div>
          </div>
        </div>
      `
    )
    .openPopup();
}
