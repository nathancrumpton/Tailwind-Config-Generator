import React from 'react';
import { Edit2, Upload, X } from 'lucide-react';

const CustomFonts = ({ fontName, setFontName, editingFontIndex, updateFont, handleFontUpload, fontFiles, editFont, removeFontFile, fileInputRef }) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <input
        type="text"
        value={fontName}
        onChange={(e) => setFontName(e.target.value)}
        placeholder="Enter font family name"
        className="flex-1 px-3 py-2 text-sm sm:text-base shadow-md shadow-black/25 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition"
      />
      {editingFontIndex !== null ? (
        <button
          onClick={updateFont}
          className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition flex items-center justify-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <Edit2 size={18} className="mr-2" />
          <span>Update Font Name</span>
        </button>
      ) : (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFontUpload}
            accept=".ttf,.otf,.woff,.woff2"
            className="hidden"
            multiple
          />
          <button
            onClick={() => fontName && fileInputRef.current.click()}
            className={`px-4 py-2 rounded-lg transition text-gray-300 flex items-center justify-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              fontName ? 'bg-purple-600 text-[#1A202C] hover:bg-purple-700' : 'bg-transparent border border-purple-600 cursor-not-allowed'
            }`}
            disabled={!fontName}
          >
            <Upload size={18} className="mr-2" />
            <span>Upload Font Files</span>
          </button>
        </>
      )}
    </div>
    <div className="space-y-2">
      {fontFiles.map((file, index) => (
        <div key={index} className="flex items-center justify-between text-sm sm:text-base">
          <span className="truncate flex-1 mr-2">{file.fontName}: {file.name}</span>
          <div className="flex-shrink-0">
            <button
              onClick={() => editFont(index)}
              className="p-1.5 bg-blue-600 rounded-full hover:bg-blue-700 transition mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => removeFontFile(index)}
              className="p-1.5 bg-red-600 rounded-full hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CustomFonts;