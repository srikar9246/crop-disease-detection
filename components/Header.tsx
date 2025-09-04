
import React from 'react';

const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="bg-green-700 shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center">
                <LeafIcon />
                <h1 className="ml-3 text-2xl font-bold text-white tracking-wider">
                    Crop Disease Detection
                </h1>
            </div>
        </header>
    );
};
