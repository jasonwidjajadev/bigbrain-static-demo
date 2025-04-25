import { Line } from "react-chartjs-2";

/**
 * Renders a line chart showing average response time for each question
 *
 * @param {Object} props - Component props
 * @param {Array} props.questionStats - Array of question statistics
 * @returns {React.ReactElement} Response time line chart component
 */
const ResponseTimeComponent = ({ questionStats }) => {

  // Extract data for the chart
  const labels = questionStats.map((stat, index) => `Q${index + 1}`); // Short labels for x-axis
  const fullQuestionTexts = questionStats.map(
    (stat) => stat.questionText || `Question ${stat.questionIndex + 1}`
  );
  const responseTimeData = questionStats.map((stat) => stat.avgTime);

  // Set up chart options and data structure
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Average Response Time (seconds)",
        data: responseTimeData,
        fill: false,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            // Return the full question text in the tooltip
            const index = context[0].dataIndex;
            return fullQuestionTexts[index];
          },
          label: function (context) {
            return `Average: ${context.raw.toFixed(1)} seconds`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Time (seconds)",
          font: {
            size: 14,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Questions",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="w-full space-y-3 bg-cyan-50 rounded p-4 h-96">
      <h2 className="text-3xl text-center font-Nunito-ExtraBold p-2 text-cyan-800">
        ⌛ Response Time
      </h2>
      <div className="text-center text-sm text-cyan-700">
        Average time taken by participants to answer each question
      </div>
      <div className="h-7/10">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ResponseTimeComponent;
