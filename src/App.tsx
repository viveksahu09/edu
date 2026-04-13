import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import UniversityDetails from "./pages/UniversityDetails";
import About from "./pages/About";
import AIChat from "./components/chat/AIChat";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import AdminRegister from "./pages/auth/AdminRegister";
import SwaggerViewer from "./components/api/SwaggerViewer";
import ApiTester from "./components/ApiTester";
import Profile from "./components/profile/UserProfile";
import AdminDashboard from "./pages/users/Dashboard";
import UserManagement from "./pages/users/UserManagement";
import RoleManagement from "./pages/users/RoleManagement";
import NavigationManagement from "./pages/users/NavigationMangement";
import DocumentManagement from "./pages/users/DocumentManagement";
import ForgotPasswordForm from "./pages/auth/ForgotPasswordForm";
import UploadDocument from "./pages/documents/UploadDocument";
import PDFViewer from "./pages/pdf/PDFViewer";
import UniversitySlider from "./components/home/UniversitySlider";
import Research from "./pages/Research";
import SubjectPage from "./pages/research/SubjectPage";
import TopicDetailPage from "./pages/research/TopicDetailPage";
import ContributePage from "./pages/research/ContributePage";
const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              />
              <div className="flex flex-1 pt-16">
                <Sidebar
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                />
                <main
                  className={`flex-1 transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? "ml-64" : "ml-0"
                  }`}
                >
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/research/:subjectId" element={<SubjectPage />} />
                    <Route path="/research/:subjectId/:topicId" element={<TopicDetailPage />} />
                    <Route path="/research/contribute" element={<ContributePage />} />
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/admin/register" element={<AdminRegister />} />
                    <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                    {/* API Documentation */}
                    <Route path="/api-docs" element={<SwaggerViewer />} />
                    <Route path="/api-tester" element={<ApiTester />} />
                    {/* Protected Routes */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat" element={
                      <ProtectedRoute>
                        <AIChat />
                      </ProtectedRoute>
                    } />
                    <Route path="/upload" element={
                      <ProtectedRoute>
                        <UploadDocument />
                      </ProtectedRoute>
                    } />
                    <Route path="/pdfviewer" element={
                      <ProtectedRoute>
                        <PDFViewer />
                      </ProtectedRoute>
                    } />
                    {/* Public Routes */}
                    <Route path="/university/" element={<UniversitySlider />} />
                    <Route
                      path="/university/:slug"
                      element={<UniversityDetails />}
                    />
                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/users/*" element={
                      <ProtectedRoute>
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/roles/*" element={
                      <ProtectedRoute>
                        <RoleManagement />
                      </ProtectedRoute>
                    } />
                    <Route
                      path="/admin/navigation/*"
                      element={<NavigationManagement />}
                    />
                    <Route
                      path="/admin/documents/*"
                      element={<DocumentManagement />}
                    />
                  </Routes>
                </main>
              </div>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
