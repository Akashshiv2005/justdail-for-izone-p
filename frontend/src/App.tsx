import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SuperAdmin from './pages/super-admin/SuperAdmin';
import BusinessOwner from './pages/dashboard/owner/BusinessOwner';
import SearchResults from './pages/SearchResults';
import LandingPage from './pages/LandingPage';
import EnterpriseRegister from './pages/EnterpriseRegister';
import CategoryPage from './pages/CategoryPage';
import SubcategoryPage from './pages/SubcategoryPage';
import BusinessDetail from './pages/BusinessDetail';

import { AuthProvider } from './lib/context/AuthContext';
import { LocationProvider } from './lib/context/LocationContext';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<EnterpriseRegister />} />
            <Route path="/register-enterprise" element={<EnterpriseRegister />} />
            <Route path="/c/:categorySlug" element={<CategoryPage />} />
            <Route path="/c/:categorySlug/:subcategorySlug" element={<SubcategoryPage />} />
            <Route path="/super-admin" element={<SuperAdmin />} />
            <Route path="/dashboard/owner" element={<BusinessOwner />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/:category/:city" element={<LandingPage />} />
            <Route path="/:category/:city/:area" element={<LandingPage />} />
            <Route path="/business/:slug" element={<BusinessDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;
