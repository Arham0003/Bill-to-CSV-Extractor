
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="w-12 h-12 border-4 border-t-indigo-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">AI is analyzing your document...</p>
    </div>
  );
};

export default Loader;
