import React, { useState } from 'react';
import { NewsItem } from '../types';

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps & { onClick: (item: NewsItem) => void }> = ({ item, onClick }) => {
  return (
    <div className="p-0 @container glass-card-light rounded-2xl transition-all hover:shadow-xl duration-300 bg-white border border-gray-100/50 flex flex-col h-full overflow-hidden">

      {/* Image Section */}
      <div
        className="w-full h-28 flex-shrink-0 bg-center bg-no-repeat bg-cover relative group cursor-pointer"
        style={{ backgroundImage: `url("${item.imageUrl}")` }}
        onClick={() => onClick(item)}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
          {item.timeAgo}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-3 gap-2 bg-white">
        <h3
          className="text-gray-900 text-[14px] font-bold leading-tight tracking-[-0.01em] line-clamp-2 cursor-pointer hover:text-[#0891b2] transition-colors"
          onClick={() => onClick(item)}
        >
          {item.title}
        </h3>

        <p className="text-gray-500 text-xs font-normal leading-relaxed line-clamp-2 flex-1">
          {item.summary}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50/50 mt-auto">
          {item.vocabulary && item.vocabulary.length > 0 && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
              {item.vocabulary.length} terms
            </span>
          )}
          <button
            onClick={() => onClick(item)}
            className="flex items-center gap-1 text-[#0891b2] font-semibold text-xs px-2 py-1 rounded transition-colors ml-auto hover:bg-[#0891b2]/5"
          >
            Analysis
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;