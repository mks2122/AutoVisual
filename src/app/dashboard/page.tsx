"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/app/components/ui/select";
// import { Input } from "src/app/components/ui/input";

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
  const state = router.state || {response:"asjdfhalksjdfhlakjsdf\n fghjk"}; // Safely access state
  const {response} = state;;
  const [chartType, setChartType] = useState("bar");
  const [data, setData] = useState(initialData);

  const generateInsights = () => {
    // const insights = [];

    // data.datasets.forEach((dataset) => {
    //   const maxValue = Math.max(...dataset.data);
    //   const minValue = Math.min(...dataset.data);
    //   const maxIndex = dataset.data.indexOf(maxValue);
    //   const minIndex = dataset.data.indexOf(minValue);

    //   insights.push(`For ${dataset.label}, the highest value is ${maxValue} in ${data.labels[maxIndex]}.`);
    //   insights.push(`For ${dataset.label}, the lowest value is ${minValue} in ${data.labels[minIndex]}.`);
    // });
    return response;
  };

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
  
      {/* Overview Section */}
      <div className="space-y-8">
        <h2 className="text-xl font-semibold text-center">Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Data Description */}
          <Card>
            <CardHeader>
              <CardTitle>Data Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                The dataset includes labels representing months and numerical datasets corresponding to two categories. These values can represent sales, performance metrics, or any other measurable feature.
              </p>
            </CardContent>
          </Card>
  
          {/* Feature Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-gray-800">
                {data.datasets.map((dataset, index) => (
                  <li key={index} className="text-sm font-medium">
                    {dataset.label} shows variations across months with an average value of {(
                      dataset.data.reduce((a, b) => a + b, 0) / dataset.data.length
                    ).toFixed(2)}.
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
  
          {/* Real-World Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Real-World Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                This visualization tool can be applied in business analytics to track sales trends, in education to analyze student performance over time, or in healthcare to monitor patient metrics across months.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
  
      
      <h2 className="text-xl font-semibold text-center">Visualization</h2>
      <div className="container mx-auto py-10">
      <VisualizationAndInsights renderChart={renderChart} response={response} />
    </div>
      <div className="container mx-auto py-10">
      <VisualizationAndInsights renderChart={renderChart} response="09865" />
    </div>
      <div className="container mx-auto py-10">
      <VisualizationAndInsights renderChart={renderChart} response="23456789" />
    </div>
      <div className="container mx-auto py-10">
      <VisualizationAndInsights renderChart={renderChart} response="{response}" />
    </div>
    </div>
  );
  
}
