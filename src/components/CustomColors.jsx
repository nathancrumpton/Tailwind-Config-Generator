import React from 'react';
import { Edit2, Plus, X } from 'lucide-react';

const CustomColors = ({ colors, hexInput, variantInput, setHexInput, setVariantInput, addOrUpdateColor, editingColorIndex, editColor, removeColor }) => {
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(hexInput);
  const isButtonEnabled = isValidHex && variantInput.trim() !== '';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          placeholder="Hex value (e.g., #FF5733)"
          className={`flex-1 px-3 py-2 text-sm sm:text-base rounded-lg bg-gray-800 border shadow-md shadow-black/25 ${
            hexInput && !isValidHex ? 'border-red-500' : 'border-gray-700'
          } text-white focus:border-blue-500 focus:outline-none transition`}
        />
        <input
          type="text"
          value={variantInput}
          onChange={(e) => setVariantInput(e.target.value)}
          placeholder="Color name (e.g., primary)"
          className="flex-1 px-3 py-2 text-sm sm:text-base shadow-md shadow-black/25 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition"
        />
        <button
          onClick={addOrUpdateColor}
          disabled={!isButtonEnabled}
          className={`px-4 py-2 rounded-lg transition flex items-center justify-center text-sm sm:text-base text-gray-300 ${
            isButtonEnabled
              ? 'bg-purple-600 text-[#1A202C] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
              : 'bg-transparent border border-purple-600 text-purple-600 cursor-not-allowed'
          }`}
        >
          {editingColorIndex !== null ? (
            <>
              <Edit2 size={14} className="mr-2" />
              <span>Update Color</span>
            </>
          ) : (
            <>
              <Plus size={14} className="mr-2" />
              <span>Add Color</span>
            </>
          )}
        </button>
      </div>
      {hexInput && !isValidHex && (
        <p className="text-red-500 text-sm">Please enter a valid hex color (e.g., #FF5733)</p>
      )}
      <div className="space-y-2">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm sm:text-base">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg"
              style={{ backgroundColor: color.hex }}
            ></div>
            <span className="flex-1">{color.variant}: {color.hex}</span>
            <button
              onClick={() => editColor(index)}
              className="p-1.5 bg-blue-600 rounded-full hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => removeColor(index)}
              className="p-1.5 bg-red-600 rounded-full hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomColors;