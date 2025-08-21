// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import InputForm from './pages/InputForm';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router>
    <Routes>
    <Route path="/" element={<WelcomePage />} />
    <Route path="/input" element={<InputForm />} />
    <Route path="/results" element={<ResultsPage />} />
    </Routes>
    </Router>
  );
}

export default App;
