import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
  return (
    <Card className="w-[450px] mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">Welcome to the Agent List Manager!</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p>Navigate to different sections:</p>
        <div className="flex flex-col space-y-2 items-center">
          <Button variant="link" asChild><Link to="/login">Login</Link></Button>
          <Button variant="link" asChild><Link to="/register">Register</Link></Button>
          <Button variant="link" asChild><Link to="/dashboard">Dashboard</Link></Button>
          <Button variant="link" asChild><Link to="/agents">Agents Management</Link></Button>
          <Button variant="link" asChild><Link to="/lists">Lists Management</Link></Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomePage; 