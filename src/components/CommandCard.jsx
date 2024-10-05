import React, { useState } from 'react';
import { X, Minus, Maximize2, Copy, Check, ClipboardCopy } from 'lucide-react';

const CommandCard = ({ command, isFileContent = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-md shadow-black/25 mt-2 w-full">
      <div className="bg-gray-700 p-2 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center">
            <X size={8} className="text-gray-900" />
          </div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center">
            <Minus size={8} className="text-gray-900" />
          </div>
          <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
            <Maximize2 size={8} className="text-gray-900" />
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-gray-200 transition-colors duration-150"
          title="Copy to clipboard"
        >
          {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}
        </button>
      </div>
      <div className="p-4 bg-gray-900 overflow-x-auto max-w-full">
        <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap break-all text-left">
          {!isFileContent && <span className="text-purple-500">$ </span>}
          {command}
        </pre>
      </div>
    </div>
  );
};

export default CommandCard;