import React, { useState } from 'react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, perform auth here.
    // For this demo, we just transition.
    onLogin();
  };

  return (
    <div className="font-display bg-[#101622] text-white min-h-screen">
      <div 
        className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-4 lg:p-8" 
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBxahprWg6kZCqV6Fzj5gNIkHa0d_M99WadNUHmt3-A_sPy2ePL8DaRau7rQ-ifQtcPVVPtmUduSc9DmC54-5WvGHRj2QvuzP8QK6oKzK1pRteWqdodFGDfH4iNGfJgViV4fQvP9KlCAxPeZCdoYSfV3NlghkdMasGcZLYO6owP8AADlTOUCOCYo5XNDSz2wJpCPQyY_mF5aUYkDf67GCJ-Zu7MD2KIpZavXXvbDiaGYUsgNO3_hLXBGlAnwpPZF_B9GYeK6WuWcx0")' }}
      >
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 -z-10 bg-[#101622]/85"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#135bec]/20 rounded-full blur-3xl opacity-50"></div>
        
        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column: Marketing Copy */}
          <div className="flex flex-col justify-center gap-6 p-4 text-white drop-shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#135bec]">
                <span className="material-symbols-outlined text-white text-2xl">insights</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white">MarketRead AI</h1>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Stay Ahead of the Curve with AI-Powered Insights.</h2>
            <p className="text-lg text-gray-200 font-medium">
              In today's fast-paced financial world, staying informed is key. MarketRead AI cuts through the noise, delivering concise, AI-driven summaries of the latest news. Understand complex market-moving events in minutes, not hours.
            </p>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-[#135bec] text-3xl">article</span>
                <div>
                  <h3 className="font-bold text-xl text-white">Intelligent Summarization</h3>
                  <p className="text-gray-300">Our advanced AI reads articles for you, extracting crucial information and presenting it in a digestible format.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-[#135bec] text-3xl">school</span>
                <div>
                  <h3 className="font-bold text-xl text-white">Expand Your Vocabulary</h3>
                  <p className="text-gray-300">We identify and explain key economic and financial terms within articles, helping you build a professional vocabulary effortlessly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Login Form */}
          <div className="glass-card-dark flex w-full flex-col gap-8 rounded-xl p-8 shadow-2xl backdrop-blur-xl border border-white/10 bg-white/5">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white">Get Started</h2>
              <p className="text-base text-gray-300">Create an account or sign in to continue.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="email">Email</label>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-600 bg-white/5 p-2.5 text-white placeholder-gray-400 focus:border-[#135bec] focus:ring-[#135bec]" 
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="password">Password</label>
                <input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-600 bg-white/5 p-2.5 text-white placeholder-gray-400 focus:border-[#135bec] focus:ring-[#135bec]" 
                />
              </div>
              
              <div className="flex flex-col gap-3 mt-4">
                <button type="submit" className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#135bec] text-base font-bold text-white transition-colors hover:bg-[#135bec]/90">
                  <span className="truncate">Sign Up</span>
                </button>
                <button type="button" onClick={onLogin} className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white/10 text-base font-bold text-white transition-colors hover:bg-white/20">
                  <span className="truncate">Log In</span>
                </button>
              </div>
            </form>
            
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-400 bg-[#151c2a]">Or continue with</span>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 bg-white/5 text-white transition-colors hover:bg-white/10">
                  <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 bg-white/5 text-white transition-colors hover:bg-white/10">
                  <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1.03c-6.85 0-11 4.54-11 10.24 0 4.55 3.01 8.41 7.21 9.77.53.1.72-.23.72-.51 0-.25-.01-1.09-.01-1.98 C5.8 19.31 5.25 17.5 5.25 17.5c-.48-1.22-1.17-1.55-1.17-1.55-1.07-.73.08-.72.08-.72 1.18.08 1.81 1.21 1.81 1.21 1.05 1.8 2.76 1.28 3.43.98.11-.76.41-1.28.75-1.58-2.62-.3-5.38-1.31-5.38-5.82 0-1.29.46-2.34 1.22-3.16-.12-.3-.53-1.5.12-3.13 0 0 .99-.32 3.25 1.21.94-.26 1.95-.39 2.96-.4.99.01 2.02.13 2.96.4 2.26-1.53 3.25-1.21 3.25-1.21.65 1.63.24 2.83.12 3.13.76.82 1.22 1.87 1.22 3.16 0 4.52-2.76 5.52-5.4 5.82.42.36.8 1.08.8 2.18 0 1.57-.01 2.84-.01 3.22 0 .28.19.62.73.51C20.01 20.68 23 16.82 23 11.27 23 5.57 18.84 1.03 12 1.03Z"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;