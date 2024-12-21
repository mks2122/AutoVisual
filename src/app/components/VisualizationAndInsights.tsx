import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const VisualizationAndInsights = ({ renderChart, response }) => {
  return (
   <div className="space-y-8">
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Chart Selector and Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Data Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Chart Selector */}
              {/* <div className="mb-4">
                <Select
                  onValueChange={(value) => setChartType(value)}
                  value={chartType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              {renderChart()}
            </CardContent>
          </Card>
  
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-gray-800">
                {/* {generateInsights().map((insight, index) => (
                  <li key={index} className="text-sm font-medium">{insight}</li>
                ))} */}
                {response}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default VisualizationAndInsights;
