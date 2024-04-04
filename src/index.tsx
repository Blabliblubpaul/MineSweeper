import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import './style.css';

import App from './App';

import store from './app/store';
import { Provider } from 'react-redux';

// @ts-ignore
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);