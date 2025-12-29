import React, { useState, useEffect, useMemo } from 'react';
import NewsCard from './NewsCard';
import TradingViewWidget from './TradingViewWidget';
import VocabularyPage from './VocabularyPage';
import { useNews } from '../hooks/useNews';
import { VocabTerm } from '../types';

import { useAuth } from '../context/AuthContext';
import SettingsModal from './SettingsModal';
import NewsDetailModal from './NewsDetailModal';
import { NewsItem } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

type Tab = 'dashboard' | 'vocabulary';

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const { user, logout } = useAuth(); // Removed unused 'user' if not needed, but keeping for now

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [latestNews, setLatestNews] = useState<NewsItem | null>(null);

  // Use React Query for news
  const { data: newsItems = [], isLoading: newsLoading } = useNews(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Check for new news
  useEffect(() => {
    if (newsItems.length > 0) {
      const latest = newsItems[0];
      setLatestNews(latest);

      const lastCheck = localStorage.getItem('lastNotificationCheck');
      if (lastCheck) {
        const lastCheckDate = new Date(lastCheck);
        const newsDate = new Date(latest.publishedAt || latest.crawledAt || Date.now());
        if (newsDate > lastCheckDate) {
          setHasUnread(true);
        }
      } else {
        setHasUnread(true);
      }
    }
  }, [newsItems]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && hasUnread) {
      setHasUnread(false);
      localStorage.setItem('lastNotificationCheck', new Date().toISOString());
    }
  };


  // Calculate filtered terms based on Search Query
  const filteredTerms = useMemo(() => {
    const terms: VocabTerm[] = [];
    const seenIds = new Set();
    const query = searchQuery.toLowerCase().trim();

    newsItems.forEach(item => {
      if (item.vocabulary) {
        item.vocabulary.forEach(term => {
          // Deduplicate and Filter
          if (!seenIds.has(term.term)) {
            // Search only by Term Name
            if (term.term.toLowerCase().includes(query)) {
              seenIds.add(term.term);
              terms.push({
                ...term,
                id: term.id || `${term.term}-${Math.random()}`
              });
            }
          }
        });
      }
    });
    return terms;
  }, [newsItems, searchQuery]);

  // Calculate filtered news based on Search Query
  const filteredNews = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return newsItems;
    return newsItems.filter(item =>
      // Search only by Title
      item.title.toLowerCase().includes(query)
    );
  }, [newsItems, searchQuery]);

  const loading = newsLoading;

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
              <div
                className="flex items-center gap-3 px-2 cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => setActiveTab('dashboard')}
              >
                <div className="size-8 text-[#0891b2]">
                  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 2.5a.5.5 0 0 0-1 0V4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.5a.5.5 0 0 0 0-1H20a2 2 0 0 0 2-2V2.5a.5.5 0 0 0-1 0V3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2.5zM3 6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6zm3 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6zm-1 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H5zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H5zm10-5.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm-1 3a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-4z"></path></svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight">AI NewsDash</h2>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all w-full text-left ${activeTab === 'dashboard'
                    ? 'bg-[#0891b2] text-white shadow-lg shadow-[#0891b2]/20'
                    : 'text-gray-600 hover:bg-[#0891b2]/10 hover:text-[#0891b2]'
                    }`}
                >
                  <span className="material-symbols-outlined">dashboard</span>
                  <p className="text-sm font-bold">Dashboard</p>
                </button>

                <button
                  onClick={() => setActiveTab('vocabulary')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all w-full text-left ${activeTab === 'vocabulary'
                    ? 'bg-[#0891b2] text-white shadow-lg shadow-[#0891b2]/20'
                    : 'text-gray-600 hover:bg-[#0891b2]/10 hover:text-[#0891b2]'
                    }`}
                >
                  <span className="material-symbols-outlined">menu_book</span>
                  <p className="text-sm font-bold">Vocabulary</p>
                </button>
              </div>
            </div>

            {/* Widget Removed */}

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Header / Search */}
            <header className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-4 self-start md:self-auto order-1 md:order-none relative">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center justify-center rounded-full h-10 w-10 glass-card-light bg-white hover:bg-[#0891b2]/10 hover:text-[#0891b2] text-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined">settings</span>
                </button>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={handleNotificationClick}
                    className="flex items-center justify-center rounded-full h-10 w-10 glass-card-light bg-white hover:bg-[#0891b2]/10 hover:text-[#0891b2] text-gray-600 transition-colors relative"
                  >
                    <span className="material-symbols-outlined">notifications</span>
                    {hasUnread && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                      <h4 className="font-bold text-gray-900 mb-2 text-sm">Notifications</h4>
                      {latestNews ? (
                        <div className="flex flex-col gap-1 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => setSelectedNews(latestNews)}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-[#0891b2] bg-[#0891b2]/10 px-1.5 py-0.5 rounded">New Arrival</span>
                            <span className="text-xs text-gray-400">{latestNews.timeAgo}</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mt-1">{latestNews.title}</p>
                          <p className="text-xs text-blue-500 mt-1 font-medium">Click to view analysis</p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">No new updates.</p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={logout}
                  title="Log Out"
                  className="flex items-center justify-center rounded-full h-10 w-10 glass-card-light bg-white hover:bg-red-500/10 hover:text-red-500 text-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </div>

              <div className="flex-1 w-full md:w-auto order-2 md:order-none">
                <form onSubmit={handleSearch} className="flex flex-col h-12 w-full">
                  <div className="flex w-full items-stretch rounded-full h-full glass-card-light bg-white">
                    <div className="text-gray-400 flex items-center justify-center pl-4">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-gray-900 focus:outline-none bg-transparent placeholder:text-gray-400 px-4 pl-2 text-base"
                      placeholder={activeTab === 'vocabulary' ? "Search vocabulary..." : "Search topics (e.g., 'Crypto', 'Fed Rates')"}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </header>

            {/* TAB CONTENT */}
            {activeTab === 'dashboard' ? (
              // Dashboard View
              <div className="flex flex-col gap-6">
                <h2 className="text-gray-900 text-[22px] font-bold tracking-[-0.015em] px-2">
                  {loading ? 'AI is analyzing news sources...' : 'Latest News Summaries'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
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
                    filteredNews.map(item => (
                      <NewsCard
                        key={item.id}
                        item={item}
                        onClick={(clickedItem) => setSelectedNews(clickedItem)}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : (
              // Vocabulary View
              <VocabularyPage terms={filteredTerms} isLoading={loading} />
            )}

          </div>

          <aside className="lg:col-span-1 flex flex-col pt-0 lg:pt-20">
            <TradingViewWidget />
          </aside>
        </main>
      </div>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <NewsDetailModal item={selectedNews} onClose={() => setSelectedNews(null)} />
    </div>
  );
};

export default Dashboard;