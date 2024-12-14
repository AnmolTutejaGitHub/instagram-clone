import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from './context/UserContext';


const ele = document.getElementById('root');
const root = ReactDOM.createRoot(ele);

root.render(
    <Provider>
        <App />
    </Provider>
);