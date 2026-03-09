import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { CompareProvider } from './context/CompareContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CompareTool from './components/compare/CompareTool';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PhoneVerificationPage from './pages/PhoneVerificationPage';
import SearchPage from './pages/SearchPage';
import ListingPage from './pages/ListingPage';
import AddListingPage from './pages/AddListingPage';
import EditListingPage from './pages/EditListingPage';
import ComparePage from './pages/ComparePage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminPage from './pages/AdminPage';
import RateTransactionPage from './pages/RateTransactionPage'; // 👈 new
import VerificationPage from './pages/VerificationPage'; // 👈 new

function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <CompareProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify-phone" element={<PhoneVerificationPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/listings/:id" element={<ListingPage />} />
                  <Route
                    path="/add-listing"
                    element={
                      <ProtectedRoute>
                        <AddListingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-listing/:id"
                    element={
                      <ProtectedRoute>
                        <EditListingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscriptions"
                    element={
                      <ProtectedRoute>
                        <SubscriptionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/rate-transactions"  // 👈 new route
                    element={
                      <ProtectedRoute>
                        <RateTransactionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/verification"        // 👈 new route
                    element={
                      <ProtectedRoute>
                        <VerificationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedAdminRoute>
                        <AdminPage />
                      </ProtectedAdminRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
              <CompareTool />
            </div>
            <Toaster position="top-right" />
          </CompareProvider>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;