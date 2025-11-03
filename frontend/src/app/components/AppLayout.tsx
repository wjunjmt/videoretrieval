"use client";

import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background-dark text-white">
      {/* SideNavBar */}
      <aside className="flex w-64 flex-col bg-[#111618] p-4">
        <div className="flex items-center gap-3 p-2 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">track_changes</span>
            <h1 className="text-lg font-bold">天眼全域感知系统</h1>
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="/main" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283339]"><span className="material-symbols-outlined">search</span><span>主页检索</span></Link>
          <Link href="/resources" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283339]"><span className="material-symbols-outlined">video_library</span><span>资源管理</span></Link>
          <Link href="/alerts" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283339]"><span className="material-symbols-outlined">warning</span><span>告警中心</span></Link>
          <Link href="/rules" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283339]"><span className="material-symbols-outlined">psychology</span><span>规则配置</span></Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283339]"><span className="material-symbols-outlined">group</span><span>用户管理</span></Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
