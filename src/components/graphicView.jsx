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

  console.log("Fecha mínima calculada:", new Date(minDate).toISOString());
  console.log("Fecha máxima calculada:", new Date(maxDate).toISOString());

  // Filtrar datos según el rango de fechas
  const filteredData = data.filter(
    (item) => new Date(item.fecha).getTime() >= minDate && new Date(item.fecha).getTime() <= maxDate
  );

  const filteredAssociate = associate
    ? associate.filter(
        (item) =>
          new Date(item.fecha).getTime() >= minDate && new Date(item.fecha).getTime() <= maxDate
      )
    : [];

  // Obtener las fechas únicas y ordenadas
  const uniqueDates = [...new Set([...filteredData, ...filteredAssociate].map((item) => item.fecha))]
    .map((fecha) => new Date(fecha))
    .sort((a, b) => a - b);

  console.log("Fechas únicas procesadas:", uniqueDates.map((date) => date.toISOString()));

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
      },
      associate && {
        label: associatedVariable,
        data: associateValues,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        spanGaps: true,
      },
    ].filter(Boolean),
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
        },
      },
      y: {
        title: {
          display: true,
          text: `Valor (${unit})`,
        },
        ticks: {
          callback: (value) => `${value} ${unit}`,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Datos a lo largo del tiempo",
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
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-4/5">
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