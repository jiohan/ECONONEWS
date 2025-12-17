import React from 'react';
import { StockItem } from '../types';

interface StockSidebarProps {
  stocks: StockItem[];
  isLoading: boolean;
}

const StockSidebar: React.FC<StockSidebarProps> = ({ stocks, isLoading }) => {
  // Simple Sparkline SVG generator
  const renderSparkline = (data: number[], isPositive: boolean) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const height = 30;
    const width = 60;
    
    // Normalize points
    const points = data.map((val, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const color = isPositive ? '#22c55e' : '#ef4444'; // Green or Red

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="glass-card-light rounded-lg p-6 flex-grow flex flex-col gap-6 h-fit sticky top-8">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 text-[20px] font-bold tracking-tight">Market Watch</h2>
        {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0891b2]"></div>}
      </div>
      
      <div className="flex flex-col gap-2">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-white/40 px-2 -mx-2 rounded transition-colors cursor-default">
            
            {/* Symbol & Name */}
            <div className="flex flex-col w-28">
              <div className="flex items-center gap-1">
                 {stock.isPositive ? 
                    <span className="material-symbols-outlined text-xs text-green-500">arrow_drop_up</span> :
                    <span className="material-symbols-outlined text-xs text-red-500">arrow_drop_down</span>
                 }
                 <span className="font-bold text-gray-900 text-sm">{stock.symbol}</span>
              </div>
              <span className="text-xs text-gray-500 truncate">{stock.name}</span>
            </div>

            {/* Sparkline */}
            <div className="hidden sm:block">
              {renderSparkline(stock.data, stock.isPositive)}
            </div>

            {/* Price & Change */}
            <div className="flex flex-col items-end w-20">
              <span className="text-sm font-bold text-gray-900">{stock.price}</span>
              <span className={`text-xs font-medium ${stock.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {stock.change}
              </span>
            </div>
          </div>
        ))}
        
        {stocks.length === 0 && !isLoading && (
            <p className="text-gray-400 text-sm italic">Market data unavailable.</p>
        )}
      </div>
      
      <div className="mt-2 text-center">
          <button className="text-xs text-[#0891b2] font-semibold hover:underline">View All Markets</button>
      </div>
    </div>
  );
};

export default StockSidebar;