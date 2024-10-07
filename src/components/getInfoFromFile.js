import * as XLSX from "xlsx";
import { excelDateToISO } from "../common/helpers";

const getInfoFromFile = async (variableName, cod_ele) => {
  try {
    const variableFile = `/src/assets/data/${variableName}/${variableName}.xlsx`;
    const response = await fetch(variableFile);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const json = XLSX.utils.sheet_to_json(worksheet);

    return json.map((item) => {
      return { value: item[cod_ele], fecha: excelDateToISO(item.Fecha) };
    });
  } catch (error) {
    console.error("Error al cargar el archivo XLSX:", error);
    return null;
  }
};

export default getInfoFromFile;
