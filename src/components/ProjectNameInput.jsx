import React from 'react';
import { AlertCircle } from 'lucide-react';

const ProjectNameInput = ({ projectName, handleProjectNameChange, isValidName }) => (
  <div className="relative">
    <input
      type="text"
      value={projectName}
      onChange={handleProjectNameChange}
      className={`w-full px-4 py-2 rounded-md bg-gray-800 text-white border shadow-md shadow-black/25 ${
        isValidName ? 'border-gray-600 focus:border-blue-500' : 'border-red-500'
      } focus:outline-none`}
      placeholder="my-tailwind-project"
    />
    {!isValidName && (
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        <AlertCircle className="text-red-500" size={20} />
      </div>
    )}
    {!isValidName && (
      <p className="mt-2 text-sm text-red-400">
        Project name should only contain lowercase letters, numbers, and hyphens.
      </p>
    )}
  </div>
);

export default ProjectNameInput;