import { useState } from "react";
import { open } from "shapefile";
import proj4 from "proj4";

// eslint-disable-next-line react/prop-types
const FileMapUpload = ({ setGeoData }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Por favor, sube archivos.");
      return;
    }

    try {
      // Usa FileReader para leer el archivo .shp
      console.log(files);
      console.log(files.find((file) => /\.shp$/.test(file.name)));
      const geoJson = await open(
        files.find((file) => /\.shp$/.test(file.name))
      ).then((source) => {
        console.log(1);
        const features = [];
        return source
          .read()
          .then(function readNext(result) {
            if (result.done) return features;
            features.push(result.value);
            return source.read().then(readNext);
          })
          .catch((e) => {
            console.log("no fue posible leer el archivo");
            console.log(e);
          });
      });

      proj4.defs(
        "EPSG:32719",
        "+proj=utm +zone=19 +south +datum=WGS84 +units=m +no_defs"
      );
      const utmToWgs84 = proj4("EPSG:32719", "EPSG:4326");

      const transformedFeatures = geoJson.map((feature) => {
        const transformedCoordinates = feature.geometry.coordinates.map(
          (ring) =>
            ring.map((coord) => {
              // Transformar cada coordenada de UTM a WGS84
              const [lng, lat] = utmToWgs84.forward(coord);
              return [lng, lat]; // Retorna como [longitud, latitud]
            })
        );

        return {
          ...feature,
          geometry: {
            ...feature.geometry,
            coordinates: transformedCoordinates, // Actualiza las coordenadas transformadas
          },
        };
      });

      setGeoData(transformedFeatures);
    } catch (error) {
      console.error("Error al leer el shapefile:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".cpg, .prj, .shp, .shx, .dbf"
        multiple
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Subir Shapefile</button>
    </div>
  );
};

export default FileMapUpload;
