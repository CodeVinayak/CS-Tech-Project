import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ChangeEvent, FormEvent } from 'react';

interface FileUploadResponse {
  message: string;
  // Add other fields expected in the response if any
}

const FileUploadForm: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage('');
        setError('');
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setUploading(true);

        if (!selectedFile) {
            setError('Please select a file to upload.');
            setUploading(false);
            return;
        }

        const allowedTypes = [
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel' // .xls
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
             setError('Invalid file type. Only CSV, XLSX, and XLS files are allowed.');
             setSelectedFile(null); // Clear selected file
             setUploading(false);
             return;
        }

        const formData = new FormData();
        formData.append('listFile', selectedFile); // 'listFile' must match the fieldname in multer config

        try {
            // Remove manual token check
            // const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

            // if (!userInfo || !userInfo.token) {
            //     setError('User not logged in. Please log in to upload files.');
            //     setUploading(false);
            //     return;
            // }

            // Remove manual config with Authorization header
            // const config = {
            //     headers: {
            //         Authorization: `Bearer ${userInfo.token}`, // Add Authorization header
            //     },
            // };

            // Use axios directly, interceptor will add the token
            const { data } = await axios.post<FileUploadResponse>(
                '/api/lists/upload',
                formData
                // Remove manual config here
                // config
            );

            setMessage(data.message || 'File uploaded successfully!');
            setSelectedFile(null); // Clear the selected file after successful upload

        } catch (err: any) {
            console.error('File upload error:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'File upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload and Distribute List</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="listFile">Select File:</Label>
                         {/* Using a standard file input as shadcn/ui doesn't have a dedicated one */}
                        <Input
                            type="file"
                            id="listFile"
                            onChange={handleFileChange}
                             // Accept only specified file types (visual hint, backend validation is crucial)
                            accept=".csv, .xlsx, .xls"
                        />
                    </div>
                    {message && <p className="text-green-500 text-sm">{message}</p>}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" disabled={!selectedFile || uploading}>
                        {uploading ? 'Uploading...' : 'Upload and Distribute'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default FileUploadForm; 