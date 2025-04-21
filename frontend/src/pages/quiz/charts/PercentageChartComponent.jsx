import { Bar } from "react-chartjs-2";

function PercentageChartComponent({ questionStats }) {
  // Extract data for the chart
  const labels = questionStats.map((stat, index) => `Q${index + 1}`); // Short labels for x-axis
  const fullQuestionTexts = questionStats.map(
    (stat) => stat.questionText || `Question ${stat.questionIndex + 1}`
  );

  const percentCorrectData = questionStats.map((stat) => stat.percentCorrect);

  // Set up chart options and data structure
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Percentage Correct",
        data: percentCorrectData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 5,
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
            return `Correct: ${context.raw.toFixed(1)}%`;
          },
          afterLabel: function (context) {
            const index = context.dataIndex;
            const stats = questionStats[index];
            return `(${stats.correctCount}/${stats.totalAttempts} correct)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Percentage (%)",
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
    <div className="w-full space-y-3 bg-green-50 rounded p-4 h-96">
      <h2 className="text-3xl text-center font-Nunito-ExtraBold p-2 text-green-800">
        📊 Percentage Correct
      </h2>
      <div className="text-center text-sm text-green-700">
        Percentage of participants who answered each question correctly
      </div>
      <div className="h-7/10">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default PercentageChartComponent;
