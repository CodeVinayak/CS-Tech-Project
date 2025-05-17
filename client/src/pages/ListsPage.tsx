import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FileUploadForm from '../components/FileUploadForm'; // Assuming this is the correct path
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ListItem {
  _id: string;
  firstName: string;
  phone: string;
  notes?: string;
}

interface DistributedList {
  _id: string;
  agent: { // Assuming agent details are populated
    _id: string;
    name: string;
    email: string;
  };
  listItems: ListItem[];
  createdAt: string;
  updatedAt: string;
}

const ListsPage: React.FC = () => {
  const [distributedLists, setDistributedLists] = useState<DistributedList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDistributedLists = async () => {
      try {
        // Remove manual token check as interceptor handles it
        const { data } = await axios.get<DistributedList[]>('/api/lists/distributed');
        setDistributedLists(data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching distributed lists:', err);
        setError(err.response?.data?.message || 'Failed to fetch distributed lists.');
        setLoading(false);
      }
    };

    fetchDistributedLists();
  }, []);

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Lists Management</h1>

        {/* Section for Uploading Lists */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload New List</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploadForm /> {/* Integrate the FileUploadForm */}
          </CardContent>
        </Card>

        {/* Section for Distributed Lists */}
        <Card>
          <CardHeader>
            <CardTitle>Distributed Lists</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading distributed lists...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && distributedLists.length === 0 && (
              <p>No distributed lists found.</p>
            )}
            {!loading && !error && distributedLists.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Number of Items</TableHead>
                    <TableHead>Distribution Date</TableHead>
                    {/* Add more table headers if needed */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributedLists.map((list) => (
                    <TableRow key={list._id}>
                      <TableCell className="text-left">{list.agent ? `${list.agent.name} (${list.agent.email})` : 'Agent Not Found'}</TableCell>
                      <TableCell className="text-left">{list.listItems.length}</TableCell>
                      <TableCell className="text-left">{new Date(list.createdAt).toLocaleDateString()}</TableCell>
                      {/* Render more data here */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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

export default ListsPage; 