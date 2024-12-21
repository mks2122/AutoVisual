'use client'

import { useState } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
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
} from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

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
)

const initialData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Category 1',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
    },
    {
      label: 'Category 2',
      data: [28, 48, 40, 19, 86, 27, 90],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Dynamic Data Visualization',
    },
  },
}

export default function DashboardPage() {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')
  const [data, setData] = useState(initialData)

  const generateInsights = () => {
    const insights: string[] = []
    data.datasets.forEach((dataset) => {
      const maxValue = Math.max(...dataset.data)
      const minValue = Math.min(...dataset.data)
      const maxIndex = dataset.data.indexOf(maxValue)
      const minIndex = dataset.data.indexOf(minValue)

      insights.push(`For ${dataset.label}, the highest value is ${maxValue} in ${data.labels[maxIndex]}.`)
      insights.push(`For ${dataset.label}, the lowest value is ${minValue} in ${data.labels[minIndex]}.`)
    })
    return insights
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const uploadedData = JSON.parse(e.target?.result as string)
          if (uploadedData.labels && uploadedData.datasets) {
            setData(uploadedData)
          } else {
            alert('Invalid data format. Ensure the JSON includes "labels" and "datasets".')
          }
        } catch {
          alert('Invalid JSON file. Please upload a valid JSON.')
        }
      }
      reader.readAsText(file)
    }
  }

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={data} options={chartOptions} />
      case 'line':
        return <Line data={data} options={chartOptions} />
      case 'pie':
        return <Pie data={{ ...data, datasets: [data.datasets[0]] }} options={chartOptions} />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Dynamic AI-Powered Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Chart Selector and Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Data Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select onValueChange={(value: 'bar' | 'line' | 'pie') => setChartType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderChart()}
          </CardContent>
        </Card>

        {/* Insights Section */}
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {generateInsights().map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Data Upload Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="file" onChange={handleFileUpload} />
            <p className="text-sm text-gray-500 mt-2">
              Upload a JSON file with <code>"labels"</code> and <code>"datasets"</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
