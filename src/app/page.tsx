"use client"

import { useState } from 'react';
import { Button } from 'src/app/components/ui/button';
import { Input } from 'src/app/components/ui/input';
import { Label } from 'src/app/components/ui/label';
import { Textarea } from 'src/app/components/ui/textarea';
import { Upload } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/analyze', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('File uploaded successfully:', result);
        alert('File uploaded successfully!');
      } else {
        alert('Failed to upload the file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Upload Your Data</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Manual Input</h2>
          <div className="space-y-2">
            <Label htmlFor="data-input">Enter your data</Label>
            <Textarea
              id="data-input"
              placeholder="Paste your data here (CSV, JSON, etc.)"
              className="h-40"
            />
          </div>
          <Button>Process Data</Button>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">File Upload</h2>
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload a file</Label>
            <div className="flex items-center space-x-2">
              <Input id="file-upload" type="file" onChange={handleFileChange} />
              <Button size="icon" onClick={handleUpload}>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-url">Or enter a file URL</Label>
            <div className="flex items-center space-x-2">
              <Input id="file-url" type="url" placeholder="https://example.com/data.csv" />
              <Button>Fetch</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
