import React from 'react';
import ClientRoutes from './routes'; // Import file routes.jsx

function ClientApp() {
  // Chỉ cần trả về component chứa router của client
  return <ClientRoutes />;
}

export default ClientApp;