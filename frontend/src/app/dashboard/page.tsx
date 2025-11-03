"use client";

import { useState } from 'react';

export default function DashboardPage() {
    return (
        <main className="flex flex-col gap-6 p-6 bg-background-dark text-white">
            <h1 className="text-4xl font-black">数据可视化仪表盘</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-white/10 bg-white/5">
                    <p className="text-white/80">视频资源总数</p>
                    <p className="text-3xl font-bold">1,283,456</p>
                </div>
                {/* Other stat cards */}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col items-center justify-center">
                        <h3 className="text-base font-medium">视频处理状态</h3>
                        <div className="w-48 h-48 bg-gray-700 rounded-full my-4 flex items-center justify-center"><p>Chart</p></div>
                    </div>
                     <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <h3 className="text-base font-medium">识别任务趋势</h3>
                        <div className="h-48 bg-gray-700 rounded my-4 flex items-center justify-center"><p>Chart</p></div>
                    </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-base font-medium">高频识别对象</h3>
                     <div className="h-48 bg-gray-700 rounded my-4 flex items-center justify-center"><p>Chart</p></div>
                </div>
            </div>
        </main>
    );
}
