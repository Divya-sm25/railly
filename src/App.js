// src/App.js
import React from 'react';
import Map from './map';
import Sidebar from './sidebar';



const App = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flexGrow: 1 }}>
        <Map />
      </div>
      
    </div>
  );
};

export default App;
