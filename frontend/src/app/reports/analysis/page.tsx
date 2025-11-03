"use client";

import { useState } from 'react';

export default function AnalysisReportPage() {
    return (
        <div className="bg-background-dark text-white min-h-screen p-8">
            <div className="max-w-[1280px] mx-auto">
                <h1 className="text-4xl font-black mb-6">专题分析报告</h1>
                <div className="flex flex-wrap gap-4 px-4 py-6">
                    <div className="flex-1 flex-col gap-2 rounded-lg border border-[#3b4c54] bg-[#1b2327] p-6">
                        <p className="font-medium">告警趋势图</p>
                        <div className="h-48 bg-gray-700 rounded my-4 flex items-center justify-center"><p>Chart Placeholder</p></div>
                    </div>
                    <div className="flex-1 flex-col gap-2 rounded-lg border border-[#3b4c54] bg-[#1b2327] p-6">
                        <p className="font-medium">人车出现频率统计</p>
                        <div className="h-48 bg-gray-700 rounded my-4 flex items-center justify-center"><p>Chart Placeholder</p></div>
                    </div>
                </div>
                <div className="px-4 py-3">
                     <div className="flex flex-col gap-2 rounded-lg border border-[#3b4c54] bg-[#1b2327] p-6">
                        <p className="font-medium">告警分布图</p>
                        <div className="w-full aspect-[16/7] bg-gray-700 rounded-lg flex items-center justify-center"><p>Map Placeholder</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
