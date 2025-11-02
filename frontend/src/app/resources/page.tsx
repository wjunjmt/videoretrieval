"use client";

import { useState, useEffect } from 'react';

type VideoResource = {
  id: number;
  filename: string;
  upload_time: string;
  duration: number | null;
  // This status is now determined client-side for simplicity
  status: 'Completed' | 'Processing' | 'Error';
};

const statusStyles: { [key: string]: string } = {
  Completed: "bg-success/20 text-success",
  Processing: "bg-warning/20 text-warning",
  Error: "bg-danger/20 text-danger",
};

export default function ResourcesPage() {
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        // Assuming backend returns fields that match VideoResource
        // We'll add a placeholder status
        const formattedData = data.map((v: any) => ({ ...v, status: 'Completed' }));
        setVideos(formattedData);
      } else {
        console.error("Failed to fetch videos");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUpload = async () => {
    if (!fileToUpload) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully! Processing has started.');
        // Refresh the video list after a short delay to allow backend to update
        setTimeout(fetchVideos, 2000);
      } else {
        alert('File upload failed.');
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert('An error occurred during upload.');
    } finally {
      setIsUploading(false);
      setIsModalOpen(false);
      setFileToUpload(null);
    }
  };

  return (
    <div className="font-display bg-background-dark text-white min-h-screen">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] p-4">Resource Management</h1>

          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Video List</h2>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 h-10 px-4 bg-primary text-white text-sm font-bold rounded-lg">
                <span className="material-symbols-outlined text-base">add</span>
                <span>Upload Video</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <p>Loading videos...</p>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-slate-400 text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-slate-400 text-sm font-medium">Upload Time</th>
                      <th className="px-4 py-3 text-slate-400 text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-slate-400 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video) => (
                      <tr key={video.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                        <td className="h-[72px] px-4 py-2">{video.filename}</td>
                        <td className="h-[72px] px-4 py-2 text-slate-400">{new Date(video.upload_time).toLocaleString()}</td>
                        <td className="h-[72px] px-4 py-2">
                          <span className={`inline-flex items-center gap-2 rounded-full h-7 px-3 text-xs font-bold ${statusStyles[video.status]}`}>
                            {video.status}
                          </span>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-sm font-bold space-x-4">
                          <button className="text-primary hover:underline">Details</button>
                          <button className="text-danger hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background-dark w-full max-w-2xl rounded-xl shadow-2xl border border-slate-800 flex flex-col">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold">Upload New Video</h2>
            </div>
            <div className="p-6 space-y-6">
              <input type="file" onChange={(e) => setFileToUpload(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
            </div>
            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="h-10 px-4 bg-slate-800 text-white text-sm font-bold rounded-lg" disabled={isUploading}>Cancel</button>
              <button onClick={handleUpload} className="h-10 px-4 bg-primary text-white text-sm font-bold rounded-lg" disabled={!fileToUpload || isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
