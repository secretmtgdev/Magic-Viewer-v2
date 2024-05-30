import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import store from './redux/Store';
import ScryfallSearch from './components/ScryfallSearch/ScryfallSearch';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ScryfallSearch />
    </Provider>
  </React.StrictMode>
);
