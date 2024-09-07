import React, { useState, useRef } from 'react';
import { Plus, X, Copy, Upload, Edit2, Grid } from 'lucide-react';

const TailwindConfigGen = () => {
  const [colors, setColors] = useState([]);
  const [hexInput, setHexInput] = useState('');
  const [variantInput, setVariantInput] = useState('');
  const [fontFiles, setFontFiles] = useState([]);
  const [fontName, setFontName] = useState('');
  const [copied, setCopied] = useState(false);
  const [fontFaceCopied, setFontFaceCopied] = useState(false);
  const [editingColorIndex, setEditingColorIndex] = useState(null);
  const [editingFontIndex, setEditingFontIndex] = useState(null);
  const fileInputRef = useRef(null);

  const addOrUpdateColor = () => {
    if (hexInput && variantInput) {
      if (editingColorIndex !== null) {
        setColors(colors.map((color, index) => 
          index === editingColorIndex ? { hex: hexInput, variant: variantInput } : color
        ));
        setEditingColorIndex(null);
      } else {
        setColors([...colors, { hex: hexInput, variant: variantInput }]);
      }
      setHexInput('');
      setVariantInput('');
    }
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const editColor = (index) => {
    const { hex, variant } = colors[index];
    setHexInput(hex);
    setVariantInput(variant);
    setEditingColorIndex(index);
  };

  const handleFontUpload = (e) => {
    const files = Array.from(e.target.files);
    if (fontName) {
      const newFontFiles = files.map(file => ({ name: file.name, fontName: fontName }));
      setFontFiles([...fontFiles, ...newFontFiles]);
      setFontName('');
    }
  };

  const removeFontFile = (index) => {
    setFontFiles(fontFiles.filter((_, i) => i !== index));
  };

  const editFont = (index) => {
    const { fontName } = fontFiles[index];
    setFontName(fontName);
    setEditingFontIndex(index);
  };

  const updateFont = () => {
    if (fontName && editingFontIndex !== null) {
      setFontFiles(fontFiles.map((font, index) => 
        index === editingFontIndex ? { ...font, fontName: fontName } : font
      ));
      setEditingFontIndex(null);
      setFontName('');
    }
  };

  const generateConfig = () => {
    let config = '/** @type {import(\'tailwindcss\').Config} */\n';
    config += 'export default {\n';
    config += '  content: [\n';
    config += '    "./index.html",\n';
    config += '    "./src/**/*.{js,ts,jsx,tsx}",\n';
    config += '  ],\n';
    config += '  theme: {\n    extend: {\n';
    
    if (colors.length > 0) {
      config += '      colors: {\n';
      colors.forEach(({ hex, variant }) => {
        config += `        '${variant}': '${hex}',\n`;
      });
      config += '      },\n';
    }
    
    if (fontFiles.length > 0) {
      config += '      fontFamily: {\n';
      const uniqueFontNames = [...new Set(fontFiles.map(file => file.fontName))];
      uniqueFontNames.forEach(name => {
        config += `        '${name}': ['${name}', 'sans-serif'],\n`;
      });
      config += '      },\n';
    }
    
    config += '    },\n  },\n  plugins: [],\n};';
    return config;
  };

  const generateFontFaceCSS = () => {
        let css = `@tailwind base;
@tailwind components;
@tailwind utilities;
      
      @layer base {
      `;
      
        if (fontFiles.length > 0) {
          fontFiles.forEach((file) => {
            const fontExtension = file.name.split('.').pop().toLowerCase();
            const fontStyle = file.name.toLowerCase().includes('italic') ? 'italic' : 'normal';
            let fontWeight = 'normal';
            if (file.name.toLowerCase().includes('bold')) {
              fontWeight = 'bold';
            } else if (file.name.toLowerCase().includes('light')) {
              fontWeight = '300';
            }
            // Add more conditions for other weights as needed
      
            // Map file extensions to correct format strings
            const formatMap = {
              'otf': 'opentype',
              'ttf': 'truetype',
              'woff': 'woff',
              'woff2': 'woff2'
            };
            const fontFormat = formatMap[fontExtension] || fontExtension;
      
            css += `  @font-face {
          font-family: '${file.fontName}';
          src: url('/${file.name}') format('${fontFormat}');
          font-weight: ${fontWeight};
          font-style: ${fontStyle};
        }
      
      `;
          });
        }
      
        css += `}
      `;
        return css;
      };

  const copyToClipboard = (content, setCopiedState) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    });
  };

  return (
    <div className="min-h-screen text-gray-100 font-sans bg-[#1A202C]">
      <nav className="bg-[#1A202C] flex justify-between fixed top-0 w-full z-50 p-4 drop-shadow-md">
        <div className="flex items-center">
          <img 
            src="/Layout_Icon.png"
            alt="Layout Icon" 
            className="w-8 h-8"
          />
          <span className="ml-4 text-[#a14ef9] text-xs font-Game tracking-wider">Tailwind-Config</span>
        </div>
        <a
          href="https://www.tailwind-gridmaker.com"
          className="flex items-center bg-transparent hover:bg-purple-700 text-purple-600 hover:text-[#1A202C] border border-purple-600 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          <Grid size={20} className="mr-2" />
          Grid Maker
        </a>
      </nav>

      <div className="p-8 pt-20 max-w-4xl mx-auto">
        <div>
          <h1 className="text-6xl font-Game tracking-wide mt-14 mb-8 text-center bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text">
            Tailwind Config Generator.
          </h1>

          <p className="text-center mb-16 text-gray-400 text-lg">
          Create the palette, upload fonts, and instantly generate Tailwind config & index.css code for your Vite and React project.
          </p>
        </div>

        <div className="m-auto w-full max-w-[550px] text-center mb-14">
          <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text">Instructions</h2>
          <div className="flex items-center justify-center">
            <ul className="text-start text-sm sm:text-lg space-y-3 text-gray-400">
              <li className="flex items-center"><span className="text-white mr-2">1.</span> Enter hex values and name the color.</li>
              <li className="flex items-center"><span className="text-white mr-2">2.</span> Name and upload your custom font files.</li>
              <li className="flex items-center"><span className="text-white mr-2">3.</span> Preview the generated config and index.css code.</li>
              <li className="flex items-center"><span className="text-white mr-2">4.</span> Copy the generated code for your project.</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Color Palette Creator</h2>
            <div className="flex flex-col space-y-2 mb-4">
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                placeholder="Enter hex value (e.g., #FF5733)"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 transition"
              />
              <input
                type="text"
                value={variantInput}
                onChange={(e) => setVariantInput(e.target.value)}
                placeholder="Enter color name (e.g., primary)"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 transition"
              />
              <button
                onClick={addOrUpdateColor}
                className="w-full p-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
              >
                {editingColorIndex !== null ? (
                  <>
                    <Edit2 size={24} className="mr-2" />
                    <span>Update Color</span>
                  </>
                ) : (
                  <>
                    <Plus size={24} className="mr-2" />
                    <span>Add Color</span>
                  </>
                )}
              </button>
            </div>
            <div className="space-y-2">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-14 h-12 rounded-lg"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <span>{color.variant}: {color.hex}</span>
                  <button
                    onClick={() => editColor(index)}
                    className="p-1 bg-blue-600 rounded-full hover:bg-blue-700 transition"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => removeColor(index)}
                    className="p-1 bg-red-600 rounded-full hover:bg-red-700 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Font Uploader</h2>
            <div className="flex flex-col space-y-2 mb-4">
              <input
                type="text"
                value={fontName}
                onChange={(e) => setFontName(e.target.value)}
                placeholder="Enter font family name"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 transition"
              />
              {editingFontIndex !== null ? (
                <button
                  onClick={updateFont}
                  className="w-full p-3 bg-green-600 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                >
                  <Edit2 size={24} className="mr-2" />
                  <span>Update Font Name</span>
                </button>
              ) : (
                <div className="mb-4">
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
                    className={`w-full py-3 px-6 rounded-lg transition flex items-center justify-center space-x-2 ${
                      fontName ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 cursor-not-allowed'
                    }`}
                    disabled={!fontName}
                  >
                    <Upload size={24} />
                    <span>Upload Font Files</span>
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {fontFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{file.fontName}: {file.name}</span>
                  <div>
                    <button
                      onClick={() => editFont(index)}
                      className="p-1 bg-blue-600 rounded-full hover:bg-blue-700 transition mr-2"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => removeFontFile(index)}
                      className="p-1 bg-red-600 rounded-full hover:bg-red-700 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Generated tailwind.config.js</h2>
          <div className="relative">
            <div className="bg-gray-800 p-4 rounded-xl shadow-inner overflow-x-auto max-h-80">
              <pre className="whitespace-pre text-sm text-gray-300">
                {generateConfig()}
              </pre>
            </div>
          </div>
          <div className="flex mt-6">
            <button
              className={`w-full py-3 px-6 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                copied ? 'bg-purple-900' : 'bg-purple-600 hover:bg-purple-700'
              } focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:outline-none`}
              onClick={() => copyToClipboard(generateConfig(), setCopied)}
            >
              <Copy size={24} />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Configuration'}</span>
            </button>
          </div>
        </div>

        {(fontFiles.length > 0) && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Generated index.css</h2>
            <div className="bg-gray-800 p-4 rounded-xl shadow-inner overflow-x-auto max-h-80">
              <pre className="whitespace-pre text-sm text-gray-300">
                {generateFontFaceCSS()}
              </pre>
            </div>
            <div className="flex mt-6">
              <button
                className={`w-full py-3 px-6 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  fontFaceCopied ? 'bg-purple-900' : 'bg-purple-600 hover:bg-purple-700'
                } focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:outline-none`}
                onClick={() => copyToClipboard(generateFontFaceCSS(), setFontFaceCopied)}
              >
                <Copy size={24} />
                <span>{fontFaceCopied ? 'Copied to Clipboard!' : 'Copy index.css'}</span>
              </button>
            </div>
          </div>
        )}

        <div className='w-full mt-10 flex flex-col items-center'>
          <h3 className='flex justify-center items-center text-gray-400 text-xs'>
            Built with
            <svg className="w-6 h-6 mx-2 fill-[#D97757]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
            </svg>
            Claude 3.5 Sonnet
          </h3>
        </div>
      </div>
    </div>
  );
};

export default TailwindConfigGen;