import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface Agent {
    _id: string;
    name: string;
    email: string;
    mobileNumber?: string;
    // Add other fields if they exist in your agent model
}

const AgentList: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                // Remove manual token check as interceptor handles it
                // Get user info from local storage
                // const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

                // if (!userInfo || !userInfo.token) {
                //     setError('User not logged in. Please log in to view agents.');
                //     setLoading(false);
                //     return;
                // }

                // Remove manual config with Authorization header
                // const config = {
                //     headers: {
                //         Authorization: `Bearer ${userInfo.token}`, // Add Authorization header
                //     },
                // };

                console.log('Attempting to fetch agents...');
                // Use axios directly, interceptor will add the token
                const { data } = await axios.get<Agent[]>('/api/agents');

                console.log('Successfully fetched agents:', data);
                setAgents(data);
                setLoading(false);
            } catch (err: any) {
                console.error('Fetch agents error:', err);
                 // Check if the error is due to unauthorized access
                if (err.response && err.response.status === 401) {
                     setError('Not authorized. Please log in.');
                 } else {
                    setError(err.response?.data?.message || 'Failed to fetch agents');
                 }
                setLoading(false);
            }
        };

        fetchAgents();
    }, []); // Empty dependency array means this runs once on component mount

    // Placeholder for Edit Agent functionality
    const editAgent = async (agentId: string) => {
        try {
            const { data } = await axios.get(`/api/agents/${agentId}`);
            console.log('Fetched agent details for editing:', data);
            // TODO: Implement actual edit logic (e.g., open a modal/form with data)
        } catch (err: any) {
            console.error('Error fetching agent details for edit:', err);
            // Display error message
            setError(err.response?.data?.message || 'Failed to fetch agent details for edit');
        }
    };

    // Placeholder for Delete Agent functionality
    const deleteAgent = async (agentId: string) => {
        if (window.confirm('Are you sure you want to delete this agent?')) {
            try {
                await axios.delete(`/api/agents/${agentId}`);
                // Remove the deleted agent from the local state
                setAgents(agents.filter(agent => agent._id !== agentId));
                // Optionally show a success message
                console.log('Agent deleted successfully');
            } catch (err: any) {
                console.error('Error deleting agent:', err);
                // Display error message
                setError(err.response?.data?.message || 'Failed to delete agent');
            }
        }
    };

    if (loading) {
        return <div>Loading agents...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
      <>
        <div>
            <h3 className="text-lg font-semibold mb-4">Agent List</h3>
            {agents.length === 0 ? (
                <p>No agents found.</p>
            ) : (
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left">Name</TableHead>
                            <TableHead className="text-left">Email</TableHead>
                            <TableHead className="text-left">Mobile Number</TableHead>
                            <TableHead className="text-left">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {agents.map((agent) => (
                            <TableRow key={agent._id}>
                                <TableCell className="text-left">{agent.name}</TableCell>
                                <TableCell className="text-left">{agent.email}</TableCell>
                                <TableCell className="text-left">{agent.mobileNumber}</TableCell>
                                <TableCell className="flex space-x-2 items-center text-left">
                                    {/* TODO: Integrate actual Edit and Delete functionality */}
                                    <Button variant="outline" size="sm" onClick={() => editAgent(agent._id)}>Edit</Button>
                                    <Button variant="destructive" size="sm" onClick={() => deleteAgent(agent._id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
      </>
    );
};

export default AgentList; 