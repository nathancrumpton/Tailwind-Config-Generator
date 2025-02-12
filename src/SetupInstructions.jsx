import React, { useState, useEffect, useRef } from 'react';
import { Grid, HelpCircle } from 'lucide-react';
import ProjectNameInput from './components/ProjectNameInput';
import CommandCard from './components/CommandCard';
import CustomColors from './components/CustomColors';
import CustomFonts from './components/CustomFonts';

/*
  This function returns the non-interactive, copy‑paste command steps.
  (Steps 2, 3, 4, 5, 6 below.)
*/
const createFrameworkData = (projectName) => ({
  steps: [
    {
      title: "Create project and navigate to project directory",
      command: `npm create vite@latest ${projectName} -- --template react
cd ${projectName}`
    },
    {
      title: "Install Tailwind CSS as a Vite plugin",
      command: `npm install tailwindcss @tailwindcss/vite`
    },
    {
      title: "Configure vite.config.ts",
      command: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`
    },
    {
      title: "Set up theme variables in index.css",
      description: "Define your theme variables using the new @theme directive. This is where you'll add your custom colors and fonts.",
      command: `@import "tailwindcss";

@theme {
  /* Your theme variables will be added here */
}

@layer base {
  /* Your @font-face declarations will be added here */
}`
    }
  ]
});

/*
  generateFontFaceCSS() produces the index.css output with theme variables
  and @font-face declarations.
*/
const generateFontFaceCSS = (fontFiles, colors) => {
  let css = `@import "tailwindcss";

@theme {`;

  // Add color theme variables
  if (colors.length > 0) {
    colors.forEach(({ hex, variant }) => {
      css += `
  --color-${variant}: ${hex};`;
    });
  }

  // Add font theme variables
  if (fontFiles.length > 0) {
    const uniqueFontNames = [...new Set(fontFiles.map(file => file.fontName))];
    uniqueFontNames.forEach(name => {
      css += `
  --font-${name}: ${name}, sans-serif;`;
    });
  }

  css += `
}

@layer base {`;

  // Add font-face declarations
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
      const formatMap = {
        otf: 'opentype',
        ttf: 'truetype',
        woff: 'woff',
        woff2: 'woff2'
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
  }

  css += `
}`;
  return css;
};

/*
  StepItem is a presentational component for each numbered step.
  The "isLast" prop controls whether the vertical connector line is rendered.
*/
const StepItem = ({ number, title, description, children, isLast }) => (
  <div className="pb-28 relative">
    <div className="flex items-start">
      <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md bg-purple-600 text-gray-900 font-bold mr-4 z-10 text-xs">
        {number}
      </div>
      <div className="flex-grow">
        <h3 className="text-base font-semibold mb-1 text-purple-600 text-left">{title}</h3>
        {description && (
          <p className="text-sm text-gray-400 mb-2 text-left">{description}</p>
        )}
        {children}
      </div>
    </div>
    {!isLast && <div className="absolute left-2.5 top-5 bottom-0 w-px bg-purple-600 -z-10"></div>}
  </div>
);

/*
  SetupInstructions is the main component.
  Order of steps:
    1. Enter Your Project Name (interactive)
    2. Create project and navigate (copy)
    3. Install Tailwind CSS as a Vite plugin (copy)
    4. Configure vite.config.ts (copy)
    5. Add Custom Colors (interactive)
    6. Add Custom Fonts (interactive)
    7. Update index.css (copy; core code only)
*/
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

  // Update the generated index.css step when colors or fonts change.
  useEffect(() => {
    const updatedData = createFrameworkData(projectName || 'my-tailwind-project');
    const updatedIndexCss = generateFontFaceCSS(fontFiles, colors);
    updatedData.steps[3].command = updatedIndexCss;
    setFrameworksData(updatedData);
  }, [projectName, colors, fontFiles]);

  const handleProjectNameChange = (e) => {
    const newName = e.target.value.replace(/\s+/g, '-').toLowerCase();
    setProjectName(newName);
    setIsValidName(/^[a-z0-9-]+$/.test(newName));
  };

  // Handlers for custom colors.
  const addOrUpdateColor = () => {
    if (hexInput && variantInput) {
      if (editingColorIndex !== null) {
        setColors(
          colors.map((color, index) =>
            index === editingColorIndex ? { hex: hexInput, variant: variantInput } : color
          )
        );
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

  // Handlers for custom fonts.
  const handleFontUpload = (e) => {
    const files = Array.from(e.target.files);
    if (fontName) {
      const newFontFiles = files.map(file => ({ name: file.name, fontName }));
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
      setFontFiles(
        fontFiles.map((font, index) =>
          index === editingFontIndex ? { ...font, fontName } : font
        )
      );
      setEditingFontIndex(null);
      setFontName('');
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className="bg-[#1A202C] flex justify-between fixed top-0 w-full z-50 p-4 drop-shadow-md border-b border-gray-900">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 154" className="w-8 h-8">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: "#1CA9BB"}} />
                <stop offset="100%" style={{stopColor: "#12CBB7"}} />
              </linearGradient>
            </defs>
            <path fill="url(#gradient)" d="M128 0C93.867 0 72.533 17.067 64 51.2C76.8 34.133 91.733 27.733 108.8 32C118.537 34.434 125.497 41.499 133.201 49.318C145.750 62.057 160.275 76.8 192 76.8C226.133 76.8 247.467 59.733 256 25.6C243.2 42.667 228.267 49.067 211.2 44.8C201.463 42.366 194.503 35.301 186.799 27.482C174.25 14.743 159.725 0 128 0ZM64 76.8C29.867 76.8 8.533 93.867 0 128C12.8 110.933 27.733 104.533 44.8 108.8C54.537 111.234 61.497 118.299 69.201 126.118C81.75 138.857 96.275 153.6 128 153.6C162.133 153.6 183.467 136.533 192 102.4C179.2 119.467 164.267 125.867 147.2 121.6C137.463 119.166 130.503 112.101 122.799 104.282C110.25 91.543 95.725 76.8 64 76.8Z"/>
          </svg>
          <div className="ml-4 flex items-center gap-2">
            <span className="text-[#a14ef9] text-xs font-Game tracking-wider">
              Tailwind-Config
            </span>
            <span className="bg-purple-900/50 text-purple-400 text-[10px] ml-1 px-2 py-0.5 rounded-full border border-purple-500/30">
              v4.0
            </span>
          </div>
        </div>
        <a
          href="https://www.tailwind-gridmaker.com"
          className="flex items-center bg-transparent hover:bg-purple-700 text-purple-600 hover:text-[#1A202C] border border-purple-600 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          <Grid size={20} className="mr-2" />
          Grid Maker
        </a>
      </nav>

      <div className="p-8 mt-20 max-w-4xl mx-auto">
        <div>
          <h1 className="text-6xl font-Game tracking-wide mt-14 mb-8 text-center bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text">
            Tailwind Config Generator.
          </h1>
          <p className="text-center mb-44 md:mb-44 text-gray-400 text-lg">
            Create the palette, upload fonts, and instantly generate Tailwind config &amp; index.css code for your new Vite and React project.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4">
          {/* Step 1: Enter Your Project Name */}
          <StepItem
            number={1}
            title="Enter Your Project Name"
            description="Choose a name for your new project."
            isLast={false}
          >
            <ProjectNameInput
              projectName={projectName}
              handleProjectNameChange={handleProjectNameChange}
              isValidName={isValidName}
            />
          </StepItem>

          {/* Step 2: Create project and navigate */}
          <StepItem number={2} title={frameworksData.steps[0].title} isLast={false}>
            <CommandCard command={frameworksData.steps[0].command} isFileContent={false} />
          </StepItem>

          {/* Step 3: Install Tailwind CSS as a Vite plugin */}
          <StepItem number={3} title={frameworksData.steps[1].title} isLast={false}>
            <CommandCard command={frameworksData.steps[1].command} isFileContent={false} />
          </StepItem>

          {/* Step 4: Configure vite.config.ts */}
          <StepItem number={4} title={frameworksData.steps[2].title} isLast={false}>
            <CommandCard command={frameworksData.steps[2].command} isFileContent={true} />
          </StepItem>

          {/* Step 5: Add Custom Colors */}
          <StepItem number={5} title="Add Custom Colors" isLast={false}>
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

          {/* Step 6: Add Custom Fonts */}
          <StepItem 
            number={6} 
            title={
              <div className="flex items-center gap-2">
                Add Custom Fonts
                <div className="relative inline-block">
                  <HelpCircle
                    size={16}
                    className="text-gray-300 cursor-pointer"
                    onMouseEnter={() => setShowFontTooltip(true)}
                    onMouseLeave={() => setShowFontTooltip(false)}
                    onClick={() => setShowFontTooltip(!showFontTooltip)}
                  />
                  {showFontTooltip && (
                    <div className="absolute z-10 w-64 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-1">
                      Place your font files in the public folder for this configuration to work.
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
            } 
            isLast={false}
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

          {/* Step 7: Update index.css */}
          <StepItem number={7} title={frameworksData.steps[3].title} isLast={true}>
            <CommandCard command={frameworksData.steps[3].command} isFileContent={true} />
          </StepItem>
        </div>
      </div>
    </>
  );
};

export default SetupInstructions;