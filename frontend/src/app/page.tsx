"use client";

import { useState } from 'react';

type SearchResult = {
  video_id: number;
  filename: string;
  filepath: string;
  score: number;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark overflow-hidden text-white">
      <div className="flex h-full w-full">
        {/* SideNavBar Placeholder */}
        <aside className="group relative flex h-full flex-col bg-[#111618] transition-all duration-300 ease-in-out w-16 hover:w-60 z-30">
          {/* Icons and text would go here */}
        </aside>

        {/* Main Content Area */}
        <main className="relative flex-1 h-full">
          {/* Map Background */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC38EgCNDc1Mc5F6Tu9NinKaClYQozwIf3Fja3MeXpHgmJ6vdzfWauerQcmunN9ghQ3ex3HHCg1wSbc8FhBWIqwehqOIkePgygcMM3en5RvPX6irqKkIWw270LOfEv2Kl1UIzO50QQfeYmgg6oqLjUdwAhL7W6-SpebZ6HLwjwQ91SFYncY3g513CDDuXcQLJQ5x8A0ejWjV-eUiGT56HtA4Omjk1TYtiyVMpSuwV1HYAotAh1Pjq--kadx-FPA3L8IOmYZYwF7Fg')" }}>
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* SearchBar at the bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 py-5 z-20">
            <form onSubmit={handleSearch} className="flex items-center gap-3 w-full bg-[#1b2327]/80 backdrop-blur-sm rounded-xl p-2 shadow-lg">
              <div className="flex flex-1 items-stretch">
                <div className="text-[#9cb0ba] flex items-center justify-center pl-3">
                  <span className="material-symbols-outlined text-2xl">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-[#9cb0ba] pl-2 text-base font-normal leading-normal"
                  placeholder="请输入视频内容描述或关键词进行检索"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg h-12 hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={isLoading}>
                {isLoading ? '搜索中...' : '搜索'}
              </button>
            </form>
          </div>
        </main>

        {/* Right Sidebar for Video Results */}
        <aside className="relative flex h-full flex-col bg-[#111618] w-80 z-20 shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.3)]">
          <div className="p-4">
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">搜索结果</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-4">
            {isLoading && <p className="text-center text-gray-400">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {results.map((video) => (
              <div key={video.video_id} className="group relative overflow-hidden rounded-lg cursor-pointer">
                <div className="bg-center bg-no-repeat aspect-video bg-cover transition-transform duration-300 group-hover:scale-110" style={{ backgroundImage: "url('https://placeholder.pics/svg/300')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3 w-full">
                  <h3 className="text-white text-base font-medium truncate">{video.filename}</h3>
                  <p className="text-gray-300 text-sm">Score: {video.score.toFixed(4)}</p>
                </div>
              </div>
            ))}
            {!isLoading && results.length === 0 && !error && (
              <p className="text-center text-gray-500 mt-4">No results found.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
