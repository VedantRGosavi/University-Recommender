import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { StickyNavbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ResultsPage } from './components/ResultsPage';
import { HowItWorks } from './components/HowItWorks';
import { UniversityDetails } from './components/UniversityDetails';
import { CompareUniversities } from './components/CompareUniversities';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <StickyNavbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          
          {/* Public Results Page */}
          <Route path="/results" element={<ResultsPage />} />
          
          {/* University Details Page */}
          <Route path="/university/:id" element={<UniversityDetails />} />
          
          {/* Compare Universities Page */}
          <Route path="/compare" element={<CompareUniversities />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ResultsPage showSavedResults={true} />
              </ProtectedRoute>
            }
          />
          
          {/* Sign In Route */}
          <Route
            path="/sign-in/*"
            element={
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
