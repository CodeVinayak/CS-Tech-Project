import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import DashboardPage from './pages/DashboardPage';
import AgentsPage from './pages/AgentsPage';
import ListsPage from './pages/ListsPage';
import HomePage from './pages/HomePage';
import './App.css'
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App relative">
        <Header />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Login Page */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Registration Page */}
          <Route path="/register" element={<RegisterForm />} />

          {/* Define other routes - Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/agents" element={<ProtectedRoute element={<AgentsPage />} />} />
          <Route path="/lists" element={<ProtectedRoute element={<ListsPage />} />} />

          {/* Default route for unmatched paths */}
          <Route path="*" element={<div>Page Not Found or Redirecting...</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
