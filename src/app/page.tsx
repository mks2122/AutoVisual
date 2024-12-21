"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For Next.js 13+ app directory
import { Button } from "src/app/components/ui/button";
import { Input } from "src/app/components/ui/input";
import { Label } from "src/app/components/ui/label";
import { Textarea } from "src/app/components/ui/textarea";

export default function Home() {
  const [file, setFile] = useState(null);
  const [purpose, setPurpose] = useState("");
  const router = useRouter(); // Initialize the router

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!purpose.trim()) {
      alert("Please provide the purpose of data analysis.");
      return;
    }

    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("purpose", purpose);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("File uploaded successfully:", result);
        alert("File uploaded successfully!");

        // Redirect to the dashboard
        router.push(
          "/dashboard", {state: {response: result}});
      } else {
        alert("Failed to upload the file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Upload Your Data</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">State the Purpose of Data Analysis</h2>
          <div className="space-y-2">
            <Label htmlFor="data-input">Enter the reason for the data analysis</Label>
            <Textarea
              id="data-input"
              placeholder="To report 3rd quarter annual report"
              className="h-40"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <Button onClick={handleUpload}>Process Data</Button>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">File Upload</h2>
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload a file</Label>
            <div className="flex items-center space-x-2">
              <Input id="file-upload" type="file" onChange={handleFileChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-url">Or enter a file URL</Label>
            <div className="flex items-center space-x-2">
              <Input id="file-url" type="url" placeholder="https://example.com/data.csv" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
