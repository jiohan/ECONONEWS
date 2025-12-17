import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import StockSidebar from './StockSidebar';
import { useNews } from '../hooks/useNews';
import { fetchStocks } from '../services/stockService';
import { NewsItem, StockItem } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  // Use React Query for news
  const { data: newsItems = [], isLoading: newsLoading, error } = useNews(1);

  // Keep stocks as local state for now (could be moved to React Query too)
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [stocksLoading, setStocksLoading] = useState(true);

  // Load stocks separately
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const data = await fetchStocks();
        setStocks(data);
      } catch (e) {
        console.error("Failed to load stocks", e);
      } finally {
        setStocksLoading(false);
      }
    };
    loadStocks();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would need backend support. 
    // For now, we just log it or we could refetch with a search param if the backend supports it.
    console.log("Search not yet implemented in backend:", searchQuery);
    // In the future: setPage(1); setSearch(query);
  };

  const loading = newsLoading || stocksLoading;

  return (
    // Force light mode colors for the dashboard as per design
    <div className="font-display bg-[#f0f7f8] text-gray-900 min-h-screen relative overflow-x-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[#0891b2]/10 opacity-50 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-20%] top-0 h-[500px] w-[500px] rounded-full bg-teal-400/10 opacity-50 blur-[120px]"></div>
      </div>

      <div className="flex h-full min-h-screen relative z-10">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-72 flex-shrink-0 p-4 sticky top-0 h-screen">
          <div className="flex h-full flex-col justify-between p-4">
            <div className="flex flex-col gap-8">
              {/* Logo */}
              <div className="flex items-center gap-3 px-2">
                <div className="size-8 text-[#0891b2]">
                  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 2.5a.5.5 0 0 0-1 0V4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.5a.5.5 0 0 0 0-1H20a2 2 0 0 0 2-2V2.5a.5.5 0 0 0-1 0V3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2.5zM3 6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6zm3 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6zm-1 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H5zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H5zm10-5.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm-1 3a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-4z"></path></svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight">AI NewsDash</h2>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col gap-2">
                <a href="#" className="flex items-center gap-3 rounded-full bg-[#0891b2] px-4 py-3 text-white shadow-lg shadow-[#0891b2]/20">
                  <span className="material-symbols-outlined">dashboard</span>
                  <p className="text-sm font-bold">Dashboard</p>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-[#0891b2]/10 hover:text-[#0891b2] rounded-full transition-colors">
                  <span className="material-symbols-outlined">sell</span>
                  <p className="text-sm font-medium">Topics</p>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-[#0891b2]/10 hover:text-[#0891b2] rounded-full transition-colors">
                  <span className="material-symbols-outlined">bookmark</span>
                  <p className="text-sm font-medium">Saved Terms</p>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0891b2]/5 border border-[#0891b2]/10">
              <p className="text-xs text-gray-500 mb-2">Pro Plan</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                <div className="bg-[#0891b2] h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs font-bold text-[#0891b2]">750 / 1000 credits</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Header / Search */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full md:w-auto">
                <form onSubmit={handleSearch} className="flex flex-col h-12 w-full">
                  <div className="flex w-full items-stretch rounded-full h-full glass-card-light bg-white">
                    <div className="text-gray-400 flex items-center justify-center pl-4">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-gray-900 focus:outline-none bg-transparent placeholder:text-gray-400 px-4 pl-2 text-base"
                      placeholder="Search topics (e.g., 'Crypto', 'Fed Rates')"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center gap-4 self-end md:self-auto">
                <button className="flex items-center justify-center rounded-full h-10 w-10 glass-card-light bg-white hover:bg-[#0891b2]/10 hover:text-[#0891b2] text-gray-600 transition-colors">
                  <span className="material-symbols-outlined">settings</span>
                </button>
                <button className="flex items-center justify-center rounded-full h-10 w-10 glass-card-light bg-white hover:bg-[#0891b2]/10 hover:text-[#0891b2] text-gray-600 transition-colors relative">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button
                  onClick={onLogout}
                  title="Log Out"
                  className="flex items-center justify-center rounded-full h-10 w-10 glass-card-light bg-white hover:bg-red-500/10 hover:text-red-500 text-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined">logout</span>
                </button>
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white shadow-sm cursor-pointer"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAm0F0WoS5TnE9PM1c8DWDgxU4ao399uwQuP63iPXwMbxPc_uQwgcMtF7MiNLq1ogDe4ZACjAOisMxrbJKkBoN_7nrpKO1Efk-AC97XtAMn1h_U0ifNScyt73UUHOvSsbgtbAsyi0lo55gwFVw-e3pV6ZFOvis7qMJ--uYFvCn8czVJVAYegVyOp2fhLD9Lo1moLw4nsc4yEk7DaQpGi383K8TrPgxkzzWNxL3k7ydGB_ZWw_fYZS-A0JeaNET-t0IcR0CGa-SU8bg")' }}
                ></div>
              </div>
            </header>

            {/* News Feed */}
            <div className="flex flex-col gap-6">
              <h2 className="text-gray-900 text-[22px] font-bold tracking-[-0.015em] px-2">
                {loading ? 'AI is analyzing news sources...' : 'Latest News Summaries'}
              </h2>

              <div className="flex flex-col gap-4">
                {loading ? (
                  // Skeleton Loading State
                  [1, 2, 3].map((i) => (
                    <div key={i} className="p-6 glass-card-light rounded-lg animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-1/3 aspect-video bg-gray-300 rounded-lg"></div>
                        <div className="w-2/3 flex flex-col gap-3">
                          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  newsItems.map(item => (
                    <NewsCard key={item.id} item={item} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Stocks */}
          <aside className="lg:col-span-1 flex flex-col pt-0 lg:pt-20">
            <StockSidebar stocks={stocks} isLoading={loading} />
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;