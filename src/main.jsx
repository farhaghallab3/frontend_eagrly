import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";


import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import ErrorBoundary from '@components/common/ErrorBoundary/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>
)
