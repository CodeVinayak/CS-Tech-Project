import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Agent {
  _id?: string;
  name: string;
  email: string;
  mobileNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AddAgentFormProps {
  onAgentAdded?: (agent: Agent) => void;
}

const AddAgentForm: React.FC<AddAgentFormProps> = ({ onAgentAdded }) => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            // Get user info from local storage - Remove manual check
            // const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

            // if (!userInfo || !userInfo.token) {
            //     setError('User not logged in. Please log in to add agents.');
            //     setLoading(false);
            //     return;
            // }

            // Remove manual config with Authorization header
            // const config = {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         Authorization: `Bearer ${userInfo.token}`, // Add Authorization header
            //     },
            // };

            const { data } = await axios.post<Agent>(
                '/api/agents',
                { name, email, mobileNumber, password }
                // Remove manual config here
                // config
            );

            setMessage('Agent added successfully!');
            setName('');
            setEmail('');
            setMobileNumber('');
            setPassword('');
            setLoading(false);

            // Call a function passed from parent to refresh agent list
            if (onAgentAdded) {
                onAgentAdded(data);
            } else {
                console.log('Agent added, but no onAgentAdded handler provided.');
            }

        } catch (err: any) {
            console.error('Add agent error:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to add agent');
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Agent</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Mobile Number (with country code)</Label>
                        <Input
                            type="text"
                            id="mobileNumber"
                            value={mobileNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMobileNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && <p className="text-green-500 text-sm">{message}</p>}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Agent'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddAgentForm; 