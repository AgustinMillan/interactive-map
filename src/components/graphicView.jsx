import PropTypes from "prop-types";
import { Line, Bar } from "react-chartjs-2";
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
  const dataDates = data.map((item) => new Date(item.fecha));
  const associateDates = associate
    ? associate.map((item) => new Date(item.fecha))
    : [];

  const allDates = [...dataDates, ...associateDates]
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a - b);

  const dataValues = allDates.map((date) => {
    const found = data.find(
      (item) => new Date(item.fecha).getTime() === date.getTime()
    );
    return found ? found.value : null;
  });

  const associateValues = allDates.map((date) => {
    if (associate) {
      const found = associate.find(
        (item) => new Date(item.fecha).getTime() === date.getTime()
      );
      return found ? found.value : null;
    }
    return null;
  });

  const chartData = {
    labels: allDates,
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
            enabled: true, // Permite zoom usando la rueda del mouse
          },
          pinch: {
            enabled: true, // Permite zoom con gestos de pinza en dispositivos táctiles
          },
          mode: "xy", // Permite zoom tanto en el eje x como en el eje y
        },
        pan: {
          enabled: true, // Permite el desplazamiento
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
