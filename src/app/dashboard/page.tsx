'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown"; // For rendering markdown
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "src/app/components/ui/card";
import VisualizationAndInsights from "src/app/components/VisualizationAndInsights";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const initialData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Category 1",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
    },
    {
      label: "Category 2",
      data: [28, 48, 40, 19, 86, 27, 90],
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgba(255, 99, 132, 1)",
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Dynamic Data Visualization",
    },
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const [response, setResponse] = useState<string | null>(null);
  const [chartType, setChartType] = useState("bar");
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // Retrieve the response from localStorage
    const storedResponse = localStorage.getItem('response');
    if (storedResponse === 'null') {
      setResponse(null);
    } else {
      setResponse(storedResponse ? JSON.parse(storedResponse) : null);
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const uploadedData = JSON.parse(e.target?.result);
          if (uploadedData.labels && uploadedData.datasets) {
            setData(uploadedData);
          } else {
            alert("Invalid data format. Ensure the JSON includes 'labels' and 'datasets'.");
          }
        } catch {
          alert("Invalid JSON file. Please upload a valid JSON.");
        }
      };
      reader.readAsText(file);
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <Bar data={data} options={chartOptions} />;
      case "line":
        return <Line data={data} options={chartOptions} />;
      case "pie":
        return <Pie data={{ ...data, datasets: [data.datasets[0]] }} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-10">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 text-center">Dynamic AI-Powered Dashboard</h1>

      {/* <div className="space-y-8">
        <h2 className="text-xl font-semibold text-center">Overview</h2>
        <div className="">
          {/* Data Description 
          <Card>
            <CardHeader>
              <CardTitle>Data Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                {response ? response.insights_and_tests : null}
              </p>
            </CardContent>
          </Card>
        </div>
      </div> */}

      {/* Render Insights and Tests as Markdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Insights and Tests</h2>
        <div className="mt-4 p-4 border rounded-md">
          <div className="mt-2">
            {/* Render the 'insights_and_tests' as markdown */}
            {response && response.insights_and_tests && (
              <ReactMarkdown>{response ? response.insights_and_tests : null}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-center">Visualization</h2>
      <div className="container mx-auto py-10">
        {response && response.generated_plots && (
          <VisualizationAndInsights plots={response.generated_plots} response={"sdfsd"} />
        )}
      </div>
    </div>
  );
}
