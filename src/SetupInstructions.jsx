import React, { useState, useEffect, useRef } from 'react';
import { Grid, HelpCircle } from 'lucide-react';
import ProjectNameInput from './components/ProjectNameInput';
import CommandCard from './components/CommandCard';
import CustomColors from './components/CustomColors';
import CustomFonts from './components/CustomFonts';

const createFrameworkData = (projectName) => ({
    steps: [
      {
        title: "Create project and navigate to project directory",
        command: `npm create vite@latest ${projectName} -- --template react
  cd ${projectName}`
      },
      {
        title: "Install Tailwind CSS and initialize",
        command: `npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p`
      },
      {
        title: "Add Custom Colors",
        command: "Custom colors will be added to the configuration"
      },
      {
        title: "Add Custom Fonts",
        command: "Custom fonts will be added to the configuration"
      },
      {
        title: "Update tailwind.config.js",
        command: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colors and fonts will be added here
    },
  },
  plugins: [],
}`
      },
      {
        title: "Update index.css",
        command: `/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

// Font-face declarations will be added here
`
      }
    ]
});

const StepItem = ({ number, title, description, children }) => (
  <div className="pb-28 relative">
    <div className="flex items-start">
      <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md bg-purple-600 text-gray-900 font-bold mr-4 z-10 text-xs">
        {number}
      </div>
      <div className="flex-grow">
        <h3 className="text-base font-semibold mb-1 text-purple-600 text-left">{title}</h3>
        {description && <p className="text-sm text-gray-400 mb-2 text-left">{description}</p>}
        {children}
      </div>
    </div>
    {number !== 6 && <div className="absolute left-2.5 top-5 bottom-0 w-px bg-purple-600 -z-10"></div>}
  </div>
);

const SetupInstructions = () => {
  const [projectName, setProjectName] = useState('');
  const [frameworksData, setFrameworksData] = useState(createFrameworkData('my-tailwind-project'));
  const [isValidName, setIsValidName] = useState(true);
  const [colors, setColors] = useState([]);
  const [hexInput, setHexInput] = useState('');
  const [variantInput, setVariantInput] = useState('');
  const [fontFiles, setFontFiles] = useState([]);
  const [fontName, setFontName] = useState('');
  const [editingColorIndex, setEditingColorIndex] = useState(null);
  const [editingFontIndex, setEditingFontIndex] = useState(null);
  const fileInputRef = useRef(null);
  const [showFontTooltip, setShowFontTooltip] = useState(false);

useEffect(() => {
    const updatedFrameworksData = createFrameworkData(projectName || 'my-tailwind-project');
    const updatedConfig = generateConfig();
    const updatedIndexCss = generateFontFaceCSS();
    
    setFrameworksData({
      ...updatedFrameworksData,
      steps: updatedFrameworksData.steps.map(step => {
        if (step.title === 'Update tailwind.config.js') {
          return { ...step, command: updatedConfig };
        } else if (step.title === 'Update index.css') {
          return { ...step, command: updatedIndexCss };
        }
        return step;
      })
    });
  }, [projectName, colors, fontFiles]);

  const handleProjectNameChange = (e) => {
    const newName = e.target.value.replace(/\s+/g, '-').toLowerCase();
    setProjectName(newName);
    setIsValidName(/^[a-z0-9-]+$/.test(newName));
  };

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
@tailwind utilities;`;

    if (fontFiles.length > 0) {
      css += `\n\n@layer base {`;

      fontFiles.forEach((file) => {
        const fontExtension = file.name.split('.').pop().toLowerCase();
        const fontStyle = file.name.toLowerCase().includes('italic') ? 'italic' : 'normal';
        let fontWeight = 'normal';
        if (file.name.toLowerCase().includes('bold')) {
          fontWeight = 'bold';
        } else if (file.name.toLowerCase().includes('light')) {
          fontWeight = '300';
        }
        
        const formatMap = {
          'otf': 'opentype',
          'ttf': 'truetype',
          'woff': 'woff',
          'woff2': 'woff2'
        };
        const fontFormat = formatMap[fontExtension] || fontExtension;
  
        css += `
  @font-face {
    font-family: '${file.fontName}';
    src: url('/${file.name}') format('${fontFormat}');
    font-weight: ${fontWeight};
    font-style: ${fontStyle};
  }`;
      });

      css += `\n}`;
    }

    return css;
  };

  return (
    <>
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

      <div className="p-8 mt-32 md:mt-36 max-w-4xl mx-auto">
        <div>
          <h1 className="text-6xl font-Game tracking-wide mt-14 mb-8 text-center bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text">
            Tailwind Config Generator.
          </h1>

          <p className="text-center mb-44 md:mb-44 text-gray-400 text-lg">
            Create the palette, upload fonts, and instantly generate Tailwind config & index.css code for your new Vite and React project.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4">
          <StepItem 
            number={1} 
            title="Enter Your Project Name"
            description="Choose a name for your new project."
          >
            <ProjectNameInput
              projectName={projectName}
              handleProjectNameChange={handleProjectNameChange}
              isValidName={isValidName}
            />
          </StepItem>
          {frameworksData.steps.slice(0, 2).map((step, index) => (
            <StepItem key={index} number={index + 2} title={step.title}>
              <CommandCard 
                command={step.command} 
                isFileContent={false}
              />
            </StepItem>
          ))}
          <StepItem 
            number={3} 
            title="Add Custom Colors"
          >
            <CustomColors
              colors={colors}
              hexInput={hexInput}
              variantInput={variantInput}
              setHexInput={setHexInput}
              setVariantInput={setVariantInput}
              addOrUpdateColor={addOrUpdateColor}
              editingColorIndex={editingColorIndex}
              editColor={editColor}
              removeColor={removeColor}
            />
          </StepItem>
          <StepItem 
  number={4} 
  title={
    <div className="flex items-center">
      <span>Add Custom Fonts</span>
      <div className="relative inline-block ml-2">
        <HelpCircle
          size={16}
          className="text-gray-300 cursor-pointer"
          onMouseEnter={() => setShowFontTooltip(true)}
          onMouseLeave={() => setShowFontTooltip(false)}
          onClick={() => setShowFontTooltip(!showFontTooltip)}
        />
        {showFontTooltip && (
          <div className="absolute z-10 w-64 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-1">
            Place your font files in the public folder of your project for this configuration to work correctly.
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  }
>
  <CustomFonts
    fontName={fontName}
    setFontName={setFontName}
    editingFontIndex={editingFontIndex}
    updateFont={updateFont}
    handleFontUpload={handleFontUpload}
    fontFiles={fontFiles}
    editFont={editFont}
    removeFontFile={removeFontFile}
    fileInputRef={fileInputRef}
  />
</StepItem>
          {frameworksData.steps.slice(4).map((step, index) => (
            <StepItem key={index} number={index + 5} title={step.title}>
              <CommandCard 
                command={step.command} 
                isFileContent={true}
              />
            </StepItem>
          ))}
        </div>
      </div>
    </>
  );
};

export default SetupInstructions;