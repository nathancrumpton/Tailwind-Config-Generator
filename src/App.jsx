import React from 'react';
import SetupInstructions from './SetupInstructions';

function App() {
  return (
    <div className="App">
      <SetupInstructions />
      <footer className="text-center text-sm text-gray-500 py-8">
        Built by{' '}
        <a href="https://github.com/nathancrumpton" className="underline hover:text-gray-300">Nathan Crumpton</a>
        {' '}·{' '}
        <a href="https://www.linkedin.com/in/nathancrumpton" className="underline hover:text-gray-300">LinkedIn</a>
        {' '}·{' '}
        <a href="https://www.tailwind-gridmaker.com" className="underline hover:text-gray-300">Grid Maker</a>
      </footer>
    </div>
  );
}

export default App;