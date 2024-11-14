import * as XLSX from "xlsx";
import variableFile from "../assets/resumen_variables.xlsx";

const getStartupVariables = async () => {
  try {
    const response = await fetch(variableFile);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return jsonData;
  } catch (error) {
    console.error("Error al cargar el archivo XLSX:", error);
    return null;
  }
};

export default getStartupVariables;
