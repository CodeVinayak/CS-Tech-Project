import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from './ui/theme-toggle';

const Header: React.FC = () => {
  const navigate = useNavigate();
  // Simple check for login status
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between w-full">
      <div className="flex items-center justify-between w-full px-4">
        {/* Placeholder for Brand/Logo */}
        <Link to="/" className="text-xl font-bold">VinayakAgentListManager</Link>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-4">
            {!isAuthenticated && (
              <>
                <li>
                  <Button variant="link" asChild className="text-white">
                    <Link to="/login">Login</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="text-white">
                    <Link to="/register">Register</Link>
                  </Button>
                </li>
              </>
            )}

            {isAuthenticated && (
              <>
                <li>
                  <Button variant="link" asChild className="text-white">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="text-white">
                    <Link to="/agents">Agents Management</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="text-white">
                    <Link to="/lists">Lists Management</Link>
                  </Button>
                </li>
                {/* Add Logout Button Here */}
                 <li>
                  <Button variant="link" asChild className="text-white">
                    <Link to="#" onClick={handleLogout}>Logout</Link>
                  </Button>
                 </li>
              </>
            )}
          </ul>
        </nav>
        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header; 