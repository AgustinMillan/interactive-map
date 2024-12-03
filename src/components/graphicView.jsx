import PropTypes from "prop-types";
import { Line, Bar } from "react-chartjs-2";
import {
  calculateDateRange,
  formatText,
  getViewToGraphic,
} from "../common/helpers";
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
import { useRef } from "react";

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
  toggle,
}) => {
  const chartRef = useRef(null); // Crear referencia al gráfico

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

  dataValues.map((item, index) => {
    if (item === null) {
      uniqueDates.splice(index, 1);
    }
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
  const TWO_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 2; // 2 meses en milisegundos

  const chartData = {
    labels: uniqueDates,
    datasets: [
      {
        label: variableName,
        data: dataValues,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        spanGaps: TWO_MONTHS_MS, // Definir el gap máximo permitido
        borderWidth: 2, // Añadir borde más grueso para mejor visibilidad en modo oscuro
      },
      associatedVariable && {
        label: associatedVariable,
        data: associateValues,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        spanGaps: TWO_MONTHS_MS, // Definir el gap máximo permitido
        borderWidth: 2, // Añadir borde más grueso para mejor visibilidad en modo oscuro
      },
    ].filter(Boolean),
  };

  if (toggle.state) {
    chartData.datasets = getViewToGraphic(toggle.value, chartData.datasets);
  }

  const options = {
    responsive: true,
    interaction: {
      mode: "nearest",
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
            const label = formatText(context.dataset.label);
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
            size: 11, // Tamaño del título del eje Y
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
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div className="flex">
      <div className="w-full" style={{ maxHeight: "300px" }}>
        {graficType === "LINEA" ? (
          <Line ref={chartRef} data={chartData} options={options} />
        ) : (
          <Bar ref={chartRef} data={chartData} options={options} />
        )}
      </div>
      <button
        onClick={handleResetZoom}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Reiniciar Zoom
      </button>
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
  toggle: PropTypes.object,
};

export default GraphicView;
