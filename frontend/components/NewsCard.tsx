import React, { useState } from 'react';
import { NewsItem } from '../types';

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 @container glass-card-light rounded-lg transition-all hover:bg-white/60 dark:hover:bg-gray-800/40 opacity-90 hover:opacity-100">
      <div className="flex flex-col items-stretch justify-start gap-4 @xl:flex-row @xl:items-start">
        <div
          className="w-full @xl:w-1/3 bg-center bg-no-repeat aspect-video bg-cover rounded-lg shadow-sm"
          style={{ backgroundImage: `url("${item.imageUrl}")` }}
        />
        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 @xl:px-4">
          <p className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">
            {item.title}
          </p>

          {/* Short Summary (Hidden when expanded) */}
          {!isExpanded && (
            <p className="text-gray-600 text-base font-normal leading-normal mb-4 line-clamp-3">
              {item.summary}
            </p>
          )}

          <div className="flex gap-2 items-center justify-between mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-[#0891b2] font-semibold text-sm hover:underline"
            >
              {isExpanded ? '접기' : '전체 분석 보기'}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <span className="text-gray-400 text-xs">{item.timeAgo}</span>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="mt-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Full Summary */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI Summary</h4>
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                  {item.fullSummary || item.summary}
                </p>
              </div>

              {/* Vocabulary Section */}
              {item.vocabulary && item.vocabulary.length > 0 && (
                <div className="bg-[#0891b2]/5 rounded-lg p-4 border border-[#0891b2]/10">
                  <h4 className="text-xs font-bold text-[#0891b2] uppercase tracking-wider mb-3">Key Terms & Concepts</h4>
                  <div className="flex flex-col gap-3">
                    {item.vocabulary.map((vocab, idx) => (
                      <div key={idx} className="flex flex-col gap-1 p-3 bg-white/50 rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{vocab.term}</span>
                          {vocab.category && <span className="text-[10px] uppercase bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{vocab.category}</span>}
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex gap-2 text-xs">
                            <span className="font-semibold text-gray-500 min-w-[30px]">정의:</span>
                            <span className="text-gray-700">{vocab.definition}</span>
                          </div>
                          {vocab.explanation && (
                            <div className="flex gap-2 text-xs">
                              <span className="font-semibold text-[#0891b2] min-w-[30px]">풀이:</span>
                              <span className="text-gray-800 bg-[#0891b2]/10 px-1 rounded -ml-1">💡 {vocab.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;