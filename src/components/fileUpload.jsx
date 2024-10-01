import * as XLSX from "xlsx";

// eslint-disable-next-line react/prop-types
const FileUpload = ({ onFileUploaded }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Asumiendo que quieres leer la primera hoja del libro
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Pasar los datos JSON al componente padre
        onFileUploaded(jsonData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return <input type="file" accept=".xlsx" onChange={handleFileChange} />;
};

export default FileUpload;
