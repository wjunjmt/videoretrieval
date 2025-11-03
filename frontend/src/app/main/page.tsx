"use client";

import { useState } from 'react';

export default function MainPage() {
  return (
    <div className="relative flex h-screen w-full bg-background-dark overflow-hidden text-white">
      {/* SideNavBar Placeholder */}
      <aside className="w-16 bg-[#111618] h-full"></aside>

      <main className="relative flex-1 h-full">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gray-700">
            {/* Map Placeholder */}
        </div>

        {/* SearchBar */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-full max-w-2xl z-20">
            <div className="bg-[#1b2327]/80 backdrop-blur-sm rounded-xl p-2 shadow-lg flex gap-2">
                <input
                  className="flex-grow bg-transparent focus:outline-none p-2"
                  placeholder="搜索关键词、场景或上传图片"
                />
                <button className="bg-primary text-white font-bold py-2 px-6 rounded-lg">搜索</button>
            </div>
        </div>
      </main>

      {/* Results Sidebar */}
      <aside className="w-80 bg-[#111618] h-full p-4">
        <h2 className="text-xl font-bold">最新/热门视频</h2>
        {/* Video results would be mapped here */}
      </aside>
    </div>
  );
}
