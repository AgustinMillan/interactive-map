/* eslint-disable react/prop-types */
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { useContext, useEffect } from "react";
import * as XLSX from "xlsx";
import { DateFilterContext } from "../context/dateFilter.context";

// Función para formatear la fecha
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const PopupComponent = ({ featureInfo, variableName }) => {
  // Extraemos los eventos y otros atributos
  const { state } = useContext(DateFilterContext);

  useEffect(() => {}, [state]);

  const events = state?.events || [];

  // Información general de la variable
  const generalInfo = {
    Variable: variableName,
    ...Object.fromEntries(Object.entries(featureInfo)),
    Unidad: state?.unit || "N/A",
  };

  const associatedData =
    state?.associate.map((event) => ({
      Fecha_ASOCIADO: formatDate(event.fecha),
      Valor_ASOCIADO: event.value,
    })) || [];

  // Crear una estructura tabular con la información general y eventos
  const combinedData = events.map((event, index) => ({
    ...generalInfo, // Repetimos la información general en cada fila
    Fecha: formatDate(event.fecha),
    Valor: event.value,
    // Si hay datos asociados en el mismo índice, los añadimos
    Fecha_ASOCIADO: associatedData[index]?.Fecha_ASOCIADO || "",
    Valor_ASOCIADO: associatedData[index]?.Valor_ASOCIADO || "",
  }));

  // Función para generar y descargar archivo CSV
  const downloadCSV = () => {
    const csv = Papa.unparse(combinedData, { newline: "\r\n" });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${variableName || "data"}.csv`);
  };

  // Función para generar y descargar archivo XLSX
  const downloadXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(combinedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${variableName || "data"}.xlsx`);
  };

  return (
    <div className="popup-container">
      <div className="card">
        <div className="card-body">
          <p className="card-text">
            <strong>Variable:</strong> {variableName}
          </p>

          <h5>Información general:</h5>
          <ul className="list-unstyled">
            {Object.entries(generalInfo).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>

          <div className="mt-3">
            <button onClick={downloadCSV} className="btn btn-primary btn-sm">
              Descargar CSV
            </button>
            <button
              onClick={downloadXLSX}
              className="btn btn-success btn-sm ms-2"
            >
              Descargar XLSX
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupComponent;
