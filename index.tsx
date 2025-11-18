import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './src/index.css';
// FIX: The error "File 'file:///router.tsx' is not a module." is resolved by adding exported content to the 'router.tsx' file. The import path is correct.
import { router } from './router';

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

// By wrapping the app startup in a DOMContentLoaded listener, we guarantee
// the #root element exists before we try to mount the React app to it.
document.addEventListener('DOMContentLoaded', startApp);