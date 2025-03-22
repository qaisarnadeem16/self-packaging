import React from 'react';
import { createRoot } from 'react-dom/client'; // Use createRoot instead of ReactDOM.render
import './index.css';
import App from './components/app';
import * as serviceWorker from './serviceWorker';

// Get the root element
const container = document.getElementById('root');

// Ensure the root element exists
if (!container) {
  throw new Error('Root container not found');
}

// Create a root and render the app
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();