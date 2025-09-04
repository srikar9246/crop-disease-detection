
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Spinner } from './components/Spinner';
import { analyzeCropImage } from './services/geminiService';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const result = await analyzeCropImage(file);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Analysis failed: ${err.message}. Please try another image.`);
      } else {
        setError("An unknown error occurred during analysis.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="bg-green-50 min-h-screen font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-10">
            {!previewUrl && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-2 text-center">
                  Detect Crop Diseases Instantly
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
                  Upload a clear photo of a crop leaf. Our AI will analyze it for diseases and provide expert recommendations.
                </p>
                <ImageUploader onImageUpload={handleImageUpload} disabled={isLoading} />
              </>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center p-12">
                <Spinner />
                <p className="mt-4 text-lg text-green-700 animate-pulse">Analyzing Image...</p>
                <p className="text-sm text-gray-500">This may take a moment.</p>
              </div>
            )}
            
            {error && !isLoading && (
                <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-red-700">Analysis Error</h3>
                    <p className="text-red-600 mt-2">{error}</p>
                    <button
                        onClick={handleReset}
                        className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {previewUrl && !isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold text-green-800 mb-4">Uploaded Image</h3>
                  <img src={previewUrl} alt="Crop leaf" className="rounded-xl shadow-md w-full max-w-sm object-cover" />
                </div>
                <div>
                  {analysisResult && <ResultDisplay result={analysisResult} />}
                  <button
                    onClick={handleReset}
                    className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Analyze Another Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by AI. For educational purposes only. Always consult a professional for confirmation.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
