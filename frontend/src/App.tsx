import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { InkRippleProvider } from './components/InkRipple';
import LivingInkCanvas from './components/LivingInkCanvas';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <InkRippleProvider>
            <BrowserRouter>
              <div className="flex flex-col min-h-screen relative text-stone-100 dark:text-stone-100 not-dark:text-ink-lightText antialiased selection:bg-ink-magenta/30 selection:text-ink-cyan">
                {/* Full-page Living Ink Aurora Mesh, Particles, and Floating Parallax Background */}
                <LivingInkCanvas />

                {/* Main Interactive Site Layer */}
                <Navbar />
                <div className="flex-1 relative z-10">
                  <Routes>
                    {/* Public Feed & Detail */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/posts/:id" element={<PostDetailPage />} />

                    {/* Public Auth */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route
                      path="/posts/new"
                      element={
                        <ProtectedRoute>
                          <CreatePostPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/posts/:id/edit"
                      element={
                        <ProtectedRoute>
                          <EditPostPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </BrowserRouter>
          </InkRippleProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
