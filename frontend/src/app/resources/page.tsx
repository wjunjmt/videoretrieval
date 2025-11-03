"use client";

import { useState } from 'react';

// Mock data
const mockVideos = [
  { id: 1, name: "Project_Alpha_Test_001.mp4", uploadTime: "2023-10-27 14:30", size: "1.2 GB", source: "手动上传", status: "已完成" },
  { id: 2, name: "Coastal_Drive_Drone_View.mov", uploadTime: "2023-10-27 11:15", size: "850 MB", source: "API导入", status: "处理中" },
  { id: 3, name: "Downtown_Intersection_Traffic.mp4", uploadTime: "2023-10-26 18:45", size: "2.5 GB", source: "API导入", status: "异常" },
];
const statusClasses: { [key: string]: string } = {
  "已完成": "bg-success/20 text-success",
  "处理中": "bg-warning/20 text-warning",
  "异常": "bg-danger/20 text-danger",
};

const VideoResources = () => (
  <div id="video-resources">
    {/* Toolbar */}
    <div className="flex flex-wrap justify-between items-center gap-4 p-4">
      <h2 className="text-slate-900 dark:text-white text-2xl font-bold">视频列表</h2>
      <div className="flex flex-1 gap-3 flex-wrap justify-start md:justify-end">
        <button className="flex items-center gap-2 h-10 px-4 bg-slate-800 text-white text-sm font-bold rounded-lg"><span className="material-symbols-outlined text-base">add</span><span>上传视频</span></button>
      </div>
    </div>
    {/* Filters */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4 items-center">
      <div className="lg:col-span-2">
        <input className="form-input w-full bg-slate-800 border-slate-700 rounded-lg" placeholder="按视频名称或关键词搜索" />
      </div>
      <button className="flex h-12 items-center justify-between px-4 bg-slate-800 border border-slate-700 rounded-lg"><span>上传时间</span><span className="material-symbols-outlined">expand_more</span></button>
      <button className="flex h-12 items-center justify-between px-4 bg-slate-800 border border-slate-700 rounded-lg"><span>状态: 全部</span><span className="material-symbols-outlined">expand_more</span></button>
    </div>
    {/* Table */}
    <div className="px-4 py-3">
      <div className="overflow-hidden rounded-lg border border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-slate-400 text-sm">视频名称</th>
              <th className="px-4 py-3 text-slate-400 text-sm">上传时间</th>
              <th className="px-4 py-3 text-slate-400 text-sm">状态</th>
              <th className="px-4 py-3 text-slate-400 text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            {mockVideos.map(v => (
              <tr key={v.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                <td className="h-[72px] px-4 py-2">{v.name}</td>
                <td className="h-[72px] px-4 py-2 text-slate-400">{v.uploadTime}</td>
                <td className="h-[72px] px-4 py-2"><div className={`inline-flex items-center gap-2 rounded-full h-7 px-3 text-xs font-bold ${statusClasses[v.status]}`}>{v.status}</div></td>
                <td className="h-[72px] px-4 py-2 text-sm font-bold space-x-4"><button className="text-primary hover:underline">编辑</button><button className="text-danger hover:underline">删除</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('videos');

  return (
    <div className="font-display bg-background-dark text-white min-h-screen">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
          <div className="p-4">
            <h1 className="text-4xl font-black">资源管理</h1>
          </div>
          <div className="px-4 pt-4">
            <div className="border-b border-slate-700">
              <nav className="flex -mb-px gap-6">
                <button onClick={() => setActiveTab('videos')} className={`px-1 py-3 border-b-2 text-base font-bold ${activeTab === 'videos' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>视频资源</button>
                <button onClick={() => setActiveTab('cameras')} className={`px-1 py-3 border-b-2 text-base font-bold ${activeTab === 'cameras' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>摄像头监控资源</button>
              </nav>
            </div>
          </div>
          {activeTab === 'videos' && <VideoResources />}
          {activeTab === 'cameras' && <div className="p-8 text-center text-slate-500">摄像头监控资源界面（未实现）</div>}
        </div>
      </div>
    </div>
  );
}
