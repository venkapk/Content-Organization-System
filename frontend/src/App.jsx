// src/App.jsx
import { useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import ImageViewer from './components/ImageViewer';
import IndexItem from './components/IndexItem';
import { processText, validateProcessedText } from './utils/textProcessing';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a valid image or PDF file.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setFile(selectedFile);
    setError('');
    setResults(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('http://localhost:5000/process-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process file');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message || 'Failed to process the file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Index Extractor</h1>
          <p className="mt-2 text-gray-600">
            Upload your document to extract and process the index
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="max-w-xl mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer block"
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <span className="text-gray-600">
                  {file ? file.name : "Click to upload or drag and drop"}
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  PDF or Images (PNG, JPG)
                </p>
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={isLoading || !file}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Processing...
                </>
              ) : (
                'Extract Index'
              )}
            </button>

            {error && (
              <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
              <h2 className="text-xl font-semibold text-white">Results</h2>
            </div>
            
            <div className="p-6">
              {/* Image Viewer Section */}
              {results.image_path && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Document with Detected Text
                  </h3>
                  <ImageViewer 
                    imagePath={results.image_path} 
                    textLines={results[Object.keys(results)[0]][0].text_lines}
                  />
                </div>
              )}

              {/* Processed Text Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Extracted Text</h3>
                {processText(results[Object.keys(results)[0]][0].text_lines).map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-4">
                    <IndexItem item={group.heading} isHeading={true} />
                    <div className="space-y-1">
                      {group.items.map((item, i) => (
                        <IndexItem key={i} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;