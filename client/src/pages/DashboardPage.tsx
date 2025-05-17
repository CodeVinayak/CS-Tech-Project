import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardPage: React.FC = () => {
  const userName = localStorage.getItem('userName') || 'Admin User';

  const [agentCount, setAgentCount] = useState<number | string>('[Number]');
  const [listCount, setListCount] = useState<number | string>('[Number]');
  const [itemCount, setItemCount] = useState<number | string>('[Number]');
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [errorCounts, setErrorCounts] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoadingCounts(true);
        const agentRes = await axios.get('/api/agents/count');
        setAgentCount(agentRes.data.count);

        const listRes = await axios.get('/api/lists/count/distributed');
        setListCount(listRes.data.count);

        const itemRes = await axios.get('/api/lists/count/items');
        setItemCount(itemRes.data.count);

        setErrorCounts(null);
      } catch (err: any) {
        console.error('Error fetching counts:', err);
        setErrorCounts('Failed to load counts');
        setAgentCount('N/A');
        setListCount('N/A');
        setItemCount('N/A');
      } finally {
        setLoadingCounts(false);
      }
    };

    fetchCounts();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <p className="mb-4">Welcome, {userName}!</p>

        {/* Section for key metrics or summaries */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Summary Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Total Agents: {loadingCounts ? 'Loading...' : errorCounts ? errorCounts : agentCount}</p>
            <p>Total Lists Uploaded: {loadingCounts ? 'Loading...' : errorCounts ? errorCounts : listCount}</p>
            <p>Total List Items: {loadingCounts ? 'Loading...' : errorCounts ? errorCounts : itemCount}</p>
            {/* Add more summary items here */}
          </CardContent>
        </Card>

        {/* Section for quick actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-4">
            <Button variant="link" asChild>
              <Link to="/agents">Manage Agents</Link>
            </Button>
            <Button variant="link" asChild>
              <Link to="/lists">View/Upload Lists</Link>
            </Button>
            {/* Add more quick actions here */}
          </CardContent>
        </Card>

        {/* Main content area - could be charts, tables, etc. */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Displaying recent list uploads or agent activity. (Placeholder)</p>
            {/* Dynamic content will go here */}
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

export default DashboardPage; 