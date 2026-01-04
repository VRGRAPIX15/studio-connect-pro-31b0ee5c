import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Placeholder routes - will be implemented in next phases */}
              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="text-center py-20">
                        <h2 className="text-2xl font-display font-semibold mb-2">Leads Management</h2>
                        <p className="text-muted-foreground">Coming in Phase 3</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="text-center py-20">
                        <h2 className="text-2xl font-display font-semibold mb-2">Clients Database</h2>
                        <p className="text-muted-foreground">Coming in Phase 3</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="text-center py-20">
                        <h2 className="text-2xl font-display font-semibold mb-2">Bookings & Calendar</h2>
                        <p className="text-muted-foreground">Coming in Phase 4</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/contracts"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="text-center py-20">
                        <h2 className="text-2xl font-display font-semibold mb-2">Contracts & E-Sign</h2>
                        <p className="text-muted-foreground">Coming in Phase 5</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="text-center py-20">
                        <h2 className="text-2xl font-display font-semibold mb-2">Invoices & Payments</h2>
                        <p className="text-muted-foreground">Coming in Phase 6</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="text-center py-20">
                        <h2 className="text-2xl font-display font-semibold mb-2">Task Management</h2>
                        <p className="text-muted-foreground">Coming in Phase 7</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="text-center py-20">
                        <h2 className="text-2xl font-display font-semibold mb-2">Settings</h2>
                        <p className="text-muted-foreground">Team management, integrations & more</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
