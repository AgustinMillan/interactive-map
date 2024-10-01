import { useEffect, useState } from "react";
import FileUpload from "./components/fileUpload";
import MapView from "./components/mapView";
import FileMapUpload from "./components/fileMapUpload";

const App = () => {
  const [variables, setVariables] = useState(null);
  const [geoData, setGeoData] = useState(null);

  const handleFileUpload = (jsonData) => {
    console.log("Datos JSON obtenidos:", jsonData);
    setVariables(jsonData);
  };

  useEffect(() => {
    console.log(variables);
    console.log(geoData);
  }, [variables, geoData]);

  return (
    <div>
      <FileUpload onFileUploaded={handleFileUpload} />
      <FileMapUpload setGeoData={setGeoData} />
      <MapView variables={(variables, geoData)} />
    </div>
  );
};

export default App;
