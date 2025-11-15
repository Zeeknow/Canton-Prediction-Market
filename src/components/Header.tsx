
import React from 'react';

interface HeaderProps {
  viewMode: 'predictor' | 'admin';
  setViewMode: (mode: 'predictor' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Canton <span className="text-cyan-400">Prediction Market</span>
            </h1>
        </div>
        <div className="flex items-center space-x-2 bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('predictor')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'predictor'
                ? 'bg-cyan-500 text-white shadow'
                : 'text-gray-300 hover:bg-gray-600'
            }`}
          >
            Predictor
          </button>
          <button
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'admin'
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-300 hover:bg-gray-600'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
