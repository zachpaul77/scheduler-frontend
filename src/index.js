import React from 'react';
import ReactDOM from 'react-dom/client';
import './reset.css';
import App from './App';
import { RoomsContextProvider } from './context/RoomContext'
import { AuthContextProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <RoomsContextProvider>
      <App />
    </RoomsContextProvider>
  </AuthContextProvider>
);