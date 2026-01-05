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
import Reports from '@/pages/Reports';
import Leads from '@/pages/Leads';
import Clients from '@/pages/Clients';
import Bookings from '@/pages/Bookings';
import Contracts from '@/pages/Contracts';
import ContractSign from '@/pages/ContractSign';
import Invoices from '@/pages/Invoices';
import Tasks from '@/pages/Tasks';
import Settings from '@/pages/Settings';
import PassportPhoto from '@/pages/PassportPhoto';
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
              
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Reports />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Leads />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Clients />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Bookings />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/contracts"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Contracts />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Public Contract Signing Route */}
              <Route path="/sign/:contractId" element={<ContractSign />} />
              
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Invoices />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Tasks />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Settings />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/passport-photo"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PassportPhoto />
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
