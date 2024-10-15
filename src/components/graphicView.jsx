import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
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
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GraphicView = ({ data, associate, variableName, associatedVariable }) => {
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
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        spanGaps: true,
      },
      associate && {
        label: associatedVariable,
        data: associateValues,
        fill: false,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
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
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Datos a lo largo del tiempo",
      },
    },
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-4/5">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

GraphicView.propTypes = {
  data: PropTypes.array.isRequired,
  variableName: PropTypes.string.isRequired,
  associatedVariable: PropTypes.string,
  associate: PropTypes.array,
};

export default GraphicView;
