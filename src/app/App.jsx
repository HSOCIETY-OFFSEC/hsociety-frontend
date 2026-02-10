// src/app/App.jsx

import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../modules/auth/context/AuthContext';
import { ThemeProvider } from '../shared/context/ThemeContext';
import AppRoutes from './routes';
import Navbar from '../shared/components/layout/Navbar';
import Footer from '../shared/components/layout/Footer';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;