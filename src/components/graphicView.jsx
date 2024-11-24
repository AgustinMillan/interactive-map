import PropTypes from "prop-types";
import { Line, Bar } from "react-chartjs-2";
import { calculateDateRange } from "../common/helpers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import "chartjs-adapter-date-fns";
import Zoom from "chartjs-plugin-zoom";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Zoom
);

const GraphicView = ({
  data,
  associate,
  variableName,
  associatedVariable,
  unit,
  graficType,
}) => {
  // Calcular rango de fechas
  const { min: minDate, max: maxDate } = calculateDateRange(data, associate);

  // Filtrar datos según el rango de fechas
  const filteredData = data.filter(
    (item) =>
      new Date(item.fecha).getTime() >= minDate &&
      new Date(item.fecha).getTime() <= maxDate
  );

  const filteredAssociate = associate
    ? associate.filter(
        (item) =>
          new Date(item.fecha).getTime() >= minDate &&
          new Date(item.fecha).getTime() <= maxDate
      )
    : [];

  // Obtener las fechas únicas y ordenadas
  const uniqueDates = [
    ...new Set(
      [...filteredData, ...filteredAssociate].map((item) => item.fecha)
    ),
  ]
    .map((fecha) => new Date(fecha))
    .sort((a, b) => a - b);

  // Obtener valores correspondientes a las fechas
  const dataValues = uniqueDates.map((date) => {
    const found = filteredData.find(
      (item) => new Date(item.fecha).getTime() === date.getTime()
    );
    return found ? found.value : null;
  });

  const associateValues = uniqueDates.map((date) => {
    if (filteredAssociate) {
      const found = filteredAssociate.find(
        (item) => new Date(item.fecha).getTime() === date.getTime()
      );
      return found ? found.value : null;
    }
    return null;
  });

  // Configuración del gráfico
  const chartData = {
    labels: uniqueDates,
    datasets: [
      {
        label: variableName,
        data: dataValues,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        spanGaps: true,
        layout:{
          padding:{
            top:0,
            bottom: 0,
            left: 0,
            right: 0,
          }
        },
        borderWidth: 2, // Añadir borde más grueso para mejor visibilidad en modo oscuro
      },
      associate && {
        label: associatedVariable,
        data: associateValues,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        spanGaps: true,
        borderWidth: 2, // Añadir borde más grueso para mejor visibilidad en modo oscuro
      },
    ].filter(Boolean),
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo oscuro para el gráfico
  };
  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
        },
        ticks: {
          font: {
            size: 11, // Tamaño de la tipografía de los ejes
            color: "white", // Color de la tipografía en modo oscuro
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Color de la cuadrícula en modo oscuro
        },
      },
      y: {
        title: {
          display: true,
          text: `Valor (${unit})`,
          font: {
            size: 11, // Tamaño del título del eje X
            color: "white", // Color del título en modo oscuro
          },
        },
        ticks: {
          callback: (value) => `${value} ${unit}`,
          font: {
            size: 11, // Tamaño de la tipografía de los ejes
            color: "white", // Color de la tipografía en modo oscuro
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Color de la cuadrícula en modo oscuro
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // Color de las etiquetas de la leyenda en modo oscuro
        },
      },
      title: {
        display: true,
        text: "Datos a lo largo del tiempo",
        color: "white", // Color del título en modo oscuro
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label?.replace("_", " ") || "";
            const value =
              context.raw !== null ? `${context.raw} ${unit}` : "N/A";
            return `${label}: ${value}`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo oscuro para el tooltip
        titleColor: "white", // Color del título del tooltip en modo oscuro
        bodyColor: "white", // Color del cuerpo del tooltip en modo oscuro
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
        pan: {
          enabled: true,
          mode: "xy",
        },
      },
    },

    backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo oscuro para el gráfico
  };  

  return (
    <div className="flex">
      <div className="w-full" style={{ maxHeight: '300px' }}>        
        {graficType === "LINEA" ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

GraphicView.propTypes = {
  data: PropTypes.array.isRequired,
  variableName: PropTypes.string.isRequired,
  associatedVariable: PropTypes.string,
  associate: PropTypes.array,
  unit: PropTypes.string,
  graficType: PropTypes.string,
};

export default GraphicView;
