import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import ReactMarkdown from "react-markdown";

const VisualizationAndInsights = ({ plots, response }) => {
  return (
   <div className="space-y-8">
        
            {plots.map((plot, index) => (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Chart Selector and Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Data Visualization</CardTitle>
            </CardHeader>
            <CardContent>
        <div key={index} className="border rounded-md p-4">
          <img src={plot[0]} alt={`Plot ${index + 1}`} className="w-full h-auto object-cover" />
        </div>
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
                
<ReactMarkdown>{plot[1]}</ReactMarkdown>
                
              </ul>
            </CardContent>
          </Card>
        </div>
                  ))}
      </div>
  );
};

export default VisualizationAndInsights;
