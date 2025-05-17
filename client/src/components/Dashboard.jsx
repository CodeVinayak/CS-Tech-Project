import React, { useState } from 'react';
import AddAgentForm from './AddAgentForm';
import AgentList from './AgentList';
import FileUploadForm from './FileUploadForm';

const Dashboard = () => {
    const [agents, setAgents] = useState([]);

    const handleAgentAdded = (newAgent) => {
        console.log('New agent added:', newAgent);
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to the Agent List Manager Dashboard!</p>

            <AddAgentForm onAgentAdded={handleAgentAdded} />

            <hr />

            <FileUploadForm />

            <hr />

            <AgentList />

            {/* TODO: Add functionality for Uploading and Distributing Lists */}
        </div>
    );
};

export default Dashboard; 