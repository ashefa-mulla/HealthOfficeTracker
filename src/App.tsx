import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { publicRoutes, authProtectedRoutes } from './Routes/allRoutes';
import NonAuthLayout from './Layouts/NonLayout';
import DashboardLayout from './Layouts/DashboardLayout';
import AuthProtected from './Routes/AuthProtected';
import './assets/scss/theme.scss';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            key={`pub-${idx}`}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            key={`prot-${idx}`}
            element={
              <AuthProtected>
                <DashboardLayout>{route.component}</DashboardLayout>
              </AuthProtected>
            }
          />
        ))}
      </Routes>
    </React.Fragment>
  );
}

export default App;
