import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { StickyNavbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ResultsPage } from './components/ResultsPage';
import { HowItWorks } from './components/HowItWorks';
import { UniversityDetails } from './components/UniversityDetails';
import { CompareUniversities } from './components/CompareUniversities';
import { CampusMapsPage } from './components/CampusMapsPage';
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
          
          {/* Campus Maps Page */}
          <Route path="/campus-maps" element={<CampusMapsPage />} />
          
          {/* Advanced Search Routes */}
          <Route path="/advanced-search" element={<ResultsPage showAdvancedOptions={true} />} />
          <Route path="/search/sat" element={<ResultsPage showSATOptions={true} />} />
          <Route path="/search/career" element={<ResultsPage showCareerOptions={true} />} />
          
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
