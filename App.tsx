
import React, { useState, useCallback } from 'react';
import { Product } from './types';
import { extractDataFromImage } from './services/geminiService';
import FileUploader from './components/FileUploader';
import DataTable from './components/DataTable';
import DownloadButton from './components/DownloadButton';
import Loader from './components/Loader';
import { FileText, UploadCloud, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setImageFile(file);
    setExtractedData(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleProcessBill = async () => {
    if (!imageFile) {
      setError('Please select an image file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setExtractedData(null);

    try {
      const data = await extractDataFromImage(imageFile);
      setExtractedData(data);
    } catch (err) {
      console.error(err);
      setError('Failed to process the image. The AI model could not extract the data. Please try a clearer image or a different file.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setImageFile(null);
    setExtractedData(null);
    setError(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans antialiased">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <header className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mb-4">
                <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Bill to CSV Extractor
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload an image of your bill or spreadsheet, and let AI transform it into a structured CSV file instantly.
          </p>
        </header>

        <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300">
          {!extractedData && (
            <div className="flex flex-col items-center">
              {!imagePreview ? (
                  <FileUploader onFileSelect={handleFileSelect} />
              ) : (
                <div className="w-full text-center">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Image Preview</h2>
                  <div className="mb-4 relative group w-full max-w-md mx-auto">
                    <img src={imagePreview} alt="Bill preview" className="rounded-lg shadow-md max-h-80 w-auto mx-auto" />
                     <button
                        onClick={resetState}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        aria-label="Remove image"
                      >
                        &times;
                      </button>
                  </div>
                </div>
              )}
              
              {imageFile && (
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                    <button
                        onClick={handleProcessBill}
                        disabled={isLoading}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <UploadCloud className="w-5 h-5 mr-2" />
                        {isLoading ? 'Processing...' : 'Extract Data'}
                    </button>
                     <button
                        onClick={resetState}
                        className="w-full sm:w-auto text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        Clear Selection
                    </button>
                </div>
              )}
            </div>
          )}

          {isLoading && <Loader />}

          {error && (
            <div className="mt-6 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative flex items-start" role="alert">
                <AlertTriangle className="h-5 w-5 mr-3 mt-1" />
                <div>
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
          )}

          {extractedData && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Extracted Data</h2>
                <div className="flex gap-4">
                    <button
                        onClick={resetState}
                        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        Start Over
                    </button>
                    <DownloadButton data={extractedData} />
                </div>
              </div>
              <DataTable data={extractedData} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
