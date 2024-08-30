// src/Sidebar.js
import React from 'react';

const Sidebar = () => {
  return (
    <div style={{ width: '250px', padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h3>Options</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li><button>Change Language</button></li>
        <li><button>Track My Train</button></li>
        <li><button>Turn On Accessible Mode</button></li>
        <li><button>Nearby Public Transport</button></li>
        <li><button>Report Issue/Emergency</button></li>
        <li><button>Settings</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
