"use client";

import { useState } from 'react';
import AppLayout from '../components/AppLayout'; // Import the layout

// ... (mock data and other components remain the same)

const VideoResources = () => (
    // ... (VideoResources component remains the same)
);

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('videos');

  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-4xl font-black mb-4">资源管理</h1>
        <div className="border-b border-slate-700">
            <nav className="flex -mb-px gap-6">
                <button onClick={() => setActiveTab('videos')} className={`px-1 py-3 border-b-2 text-base font-bold ${activeTab === 'videos' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>视频资源</button>
                <button onClick={() => setActiveTab('cameras')} className={`px-1 py-3 border-b-2 text-base font-bold ${activeTab === 'cameras' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>摄像头监控资源</button>
            </nav>
        </div>
        {/* The rest of the page content */}
      </div>
    </AppLayout>
  );
}
