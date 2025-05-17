import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddAgentForm from '../components/AddAgentForm'; // Assuming this is the correct path
import AgentList from '../components/AgentList'; // Assuming this is the correct path
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const AgentsPage: React.FC = () => {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Agents Management</h1>

        {/* Section for Adding New Agents */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <AddAgentForm /> {/* Integrate the existing AddAgentForm */}
          </CardContent>
        </Card>

        {/* Section for Agent List */}
        <Card>
          <CardHeader>
            <CardTitle>Agent List</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentList /> {/* Integrate the existing AgentList */}
          </CardContent>
        </Card>
      </div>
      <div className="text-center mt-4">
        <Button variant="link" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </>
  );
};

export default AgentsPage; 