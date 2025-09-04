
import React from 'react';
import type { AnalysisResult } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult;
}

const HealthyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const DiseasedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const Pill: React.FC<{ text: string; isHealthy: boolean }> = ({ text, isHealthy }) => {
  const baseClasses = "flex items-center px-4 py-1 rounded-full text-lg font-bold";
  const healthyClasses = "bg-green-100 text-green-800";
  const diseasedClasses = "bg-yellow-100 text-yellow-800";

  return (
    <div className={`${baseClasses} ${isHealthy ? healthyClasses : diseasedClasses}`}>
      {isHealthy ? <HealthyIcon /> : <DiseasedIcon />}
      <span>{text}</span>
    </div>
  );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center md:justify-start">
        <Pill text={result.diseaseName} isHealthy={result.isHealthy} />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Description</h3>
        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{result.description}</p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
            {result.isHealthy ? "Care Recommendations" : "Treatment Suggestions"}
        </h3>
        <ul className="space-y-3">
          {result.treatmentSuggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start p-4 bg-green-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 text-green-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-700">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
