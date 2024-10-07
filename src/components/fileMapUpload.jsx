import * as shapefile from "shapefile";
import proj4 from "proj4";

const loadMapData = async (variableName) => {
  try {
    // Construir la ruta dinámica a la carpeta de datos de la variable
    const basePath = `/src/assets/data/${variableName}/`;
    const shpFilePath = `${basePath}shapefile/${variableName}.shp`;
    const shxFilePath = `${basePath}shapefile/${variableName}.shx`;
    const dbfFilePath = `${basePath}shapefile/${variableName}.dbf`;

    const shpFile = await fetch(shpFilePath).then((res) => res.arrayBuffer());
    const shxFile = await fetch(shxFilePath).then((res) => res.arrayBuffer());
    const dbfFile = await fetch(dbfFilePath).then((res) => res.arrayBuffer());

    // Usar la biblioteca shapefile para abrir los archivos y generar el geoJSON
    const source = await shapefile.open(shpFile, dbfFile, shxFile);

    const features = [];
    let result = await source.read();
    while (!result.done) {
      const transformedFeature = transformCoordinates(result.value);
      features.push(transformedFeature);
      result = await source.read();
    }

    return features; // Retorna las features con coordenadas convertidas
  } catch (error) {
    alert(
      `Error al cargar los archivos para ${variableName}. Verifica que todo este en la asignacion de nombres.`
    );
    console.error(`Error al cargar los archivos para ${variableName}:`, error);
  }
};

export default loadMapData;

proj4.defs(
  "EPSG:32719",
  "+proj=utm +zone=19 +south +datum=WGS84 +units=m +no_defs"
);
const utmToWgs84 = proj4("EPSG:32719", "EPSG:4326");

const transformCoordinates = (feature) => {
  const transformedCoordinates = feature.geometry.coordinates.map((ring) => {
    if (!Array.isArray(ring)) {
      return ring;
    }
    return ring.map((coord) => {
      const [lng, lat] = utmToWgs84.forward(coord); // Convierte de UTM a WGS84
      return [lng, lat];
    });
  });

  return {
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: transformedCoordinates, // Usar coordenadas transformadas
    },
  };
};
