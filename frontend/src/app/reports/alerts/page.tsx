"use client";

import { useState } from 'react';

export default function AlertReportPage() {
    return (
        <main className="flex-1 overflow-y-auto bg-background-dark text-white p-8">
            <h1 className="text-4xl font-black mb-2">告警统计报告</h1>
            <p className="text-[#9ca6ba] mb-6">对历史告警数据进行多维度统计分析。</p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
                <div className="flex flex-col gap-2 rounded-lg border border-[#3b4354] bg-[#1a1c23] p-6">
                    <p className="text-[#9ca6ba]">总告警数</p>
                    <p className="text-3xl font-bold">1,284</p>
                </div>
                {/* Other stats cards */}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-4 rounded-lg border border-[#3b4354] bg-[#1a1c23] p-6">
                    <h3 className="text-xl font-bold">告警趋势分析</h3>
                    <div className="aspect-[16/9] w-full bg-gray-700 rounded flex items-center justify-center"><p>Chart Placeholder</p></div>
                </div>
                <div className="flex flex-col gap-4 rounded-lg border border-[#3b4354] bg-[#1a1c23] p-6">
                    <h3 className="text-xl font-bold">告警类型分布</h3>
                    <div className="aspect-[16/9] w-full bg-gray-700 rounded flex items-center justify-center"><p>Chart Placeholder</p></div>
                </div>
            </div>
        </main>
    );
}
